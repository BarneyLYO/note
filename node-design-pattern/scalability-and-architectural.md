# Scalability and Architectural Pattern

- three dimensions of scalability

  - fundamental principle: load distribution ( the art of scalability)
  - model: scale cube
    - x: cloning (vertical scaling)
    - y: decomposing by service/functionality (mirco service)
    - z: splitting by data partition (horizontal/vertical partitioning)
  - cloning and load balancing

    - vertical scaling: adding more resource to a single machine
    - horizontal scaling: adding more machine to the infrastructure
    - node killer module: cluster

      - the cluster module simplifies the forking of new instances of the same application and automatically distribute incoming connections across them.
      - roles:
        - master process: spawing a number of processes(workers)
        - worker: representing an instance of the application.
      - loading algorithm: round-robin, to modify to set the cluster.shedulingPolicy to enums as [cluster.SCHED_RR or cluster.SCHED_NONE(by os)]

      - when using cluster mode, every server.listen() in worker process is delegated to the master process. and the master process will distribute them evenly amount the pool of worker.

      ```ts
      import { createServer } from 'http';
      import { cpus } from 'os';
      import cluster from 'cluster';
      if (cluster.isMaster) {
        const availableCpus = cpus();
        console.log(`Clustering to ${availableCpus.length} processes`);
        availableCpus.forEach(() => cluster.fork());
        cluster.on('exit', (worker, code) => {
          if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(
              `Worker ${worker.process.pid} crashed. start a new worker`
            );
            cluster.fork();
          }
        });
      } else {
        const { pid } = process;
        const server = createServer((req, res) => {
          let i = 1e7;
          while (i > 0) {
            i--;
          }
          res.end(`Hello from ${pid}`);
        });
        server.listen(8080, () => console.log(`Started at ${pid}`));
      }
      ```

      - underneath the cluster.fork(), use the child_process.fork() api, we also have a communication channel available between the master and the workers.

      ```ts
      Object.values(cluster.workers).forEach(worker =>
        worker.send('hello from master')
      );
      ```

      - zero-downtime restart

      ```ts
      import { once } from 'events';
      if (cluster.isMaster) {
        process.on('SIGUSR2', async () => {
          const workers = Object.values(cluster.workers);
          for (const worker of workers) {
            console.log(`stopping worker ${worker.process.pid}`);
            worker.disconnect();
            await once(worker, 'exit');
            if (!worker.exitedAfterDisconnect) continue;
            const newWorker = cluster.fork();
            await once(newWorker, 'listener');
          }
        });
      } else {
      }
      ```

      -production: pm2

  - Dealing with stateful communications

    - cluster does not automatically handle the the stateful communication across the worker process.
    - Sharing the state across multiple instance.

      1. use shared datastore(DB)

      - pattern:
        - sticky load balancing: using the load balancer always routing all of the requests associated with a session to the same instance of applcation.(sticky-session)
          - dont use it. unless you are using socket.io

      2. dont use cluster instead use the multiple standalone instance with reverse proxy.

      - pro:
        1. a reverse proxy can distribute the load across several machines not just several processes.
        2. reverse proxies on the market support sticky load balancing out of the box
        3. reverse proxy can route a request to any available server regardless of its programming language or platform.
        4. load balancing customizable

      3. using cluster module combined with a reverse proxy, using cluster to scale vertically inside a single machine and using reverse proxy to scale horizontally across different nodes.

      - nginx

      ```ts
      import { createServer } from 'http';
      const { pid } = process;
      const server = createServer((req, res) => {
        let i = 1e7;
        while (i > 0) {
          i--;
        }
        console.log(`Handling request from ${pid}`);
        res.end(`Hello from ${pid}\n`);
      });
      const port = Number.parseInt(process.env.PORT || process.argv[2]) || 8080;

      server.listen(port, () => console.log(`Started at ${pid}`));

      //forever start app.js 8081
      //forever start app.js 8082
      //forever start app.js 8083
      //forever start app.js 8084

      //forever list
      //forever stopall
      //forever stop <id>
      ```

      ```conf
        # run Nginx as standalone process using the current unprivileged user and by keeping the process running in the forground of the current terminal(can Ctrl + C)
        daemon off;

        error_log /dev/stderr info;
        events {
          # how network connections are managed by Nginx. max simultaneous connections can be opened by Nginx worker process to 2048
          worker_connections 2048
        }
        http {

          access_log /dev/stdout;
          upstream my-load-balanced-app {
            server 127.0.0.1:8081;
            server 127.0.0.1:8082;
            server 127.0.0.1:8083;
            server 127.0.0.1:8084
          }
          server {
            listen 8080;
            location / {
              #forward any request to the server group we defined before
              proxy_pass http://my-load-balanced-app
            }
          }
        }
        # nginx -c ${PWD}/nginx.conf
      ```

          - we need a dedicated supervisor, an external process that monitors our application and restarts it if necessary.
            - forever/pm2
            - systemd/runit
            - monit/supervisord
            - Kubernetes/Nomad/Docker Swarm

  - Dynamic Horizontal scaling

    - if the system is experiencing a performance degradation caused by a peak in traffic, the system automatically spawns new servers to cope with the increased load. vise versa.
    - pattern

      1. service registry: keep track of the running servers and the service they provided.

      - the service registry oftenly present as a table:
        <table>
          <thead>
            <tr>
              <th>type</th>
              <th>route</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>api</td>
              <td>
                <ul>
                  <li>api1.a.com:8080</li>
                  <li>api2.a.com:8080</li>
                  <li>api3.a.com:8080</li>
                </ul>
              </td>
            </tr>
             <tr>
              <td>web</td>
              <td>
                <ul>
                  <li>web1.a.com:8080</li>
                  <li>web2.a.com:8080</li>
                  <li>web3.a.com:8080</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      - Consul: a server registry to replicate the multiservice architecture.

      ```js
      //app.js
      import {createServer} from 'http'
      import consul from 'consul
      import portfinder from 'portfinder'
      import {nanoid} from 'nanoid'

      const serviceType = process.argv[2]
      const {pid} = process
      const getFreePort = portfinder.getPortPromise;
      const address = process.env.ADDRESS || 'local-host'
      const consulClient = consul()
      const port = await getFreePort()
      const serviceId = nanoid()

      function registerService () {
        consulClient.agent.service.register({
          id:serviceId,
          name:serviceType,
          address,
          port,
          tags:[serviceType]
        }, () => console.log(`${serviceType} registered successfully`))
      }

      function unregisterService (err) {
        err && console.error(err)
        console.log(`deregistering ${serviceId}`)
        consulClient.agent.service.deregister(serviceId,()=> process.exit(err?1:0))
      }

      async function main () {
        process.on('exit', unregisterService)
        process.on('uncaughtException', unregisterService)
        process.on('SIGINT', unregisterService)
        const server = createServer((req,res) => {
          let i = ie7; while(i > 0) {i--}
          console.log(`Handling request from ${pid}`)
          res.end(
            `Started ${serviceType} at ${pid} on port ${port}`
          );
        })

        server.listen(port, address, () => {
          registerService()
          console.log(`Started ${serviceType} at ${pid} on port ${port}`)
        })
      }

      main().catch(err => {
        console.error(err)
        process.exit(1)
      })

      //loadBalancer.js
      import {createServer} from 'http'
      import httpProxy from 'http-proxy'
      import consul from 'consul'
      const routing = [
        {
          path:'/api',
          service:'api-service',
          index:0
        },
        {
          path:'/',
          service:'webapp-service',
          index:0
        }
      ]

      const consulClient = consul()
      const Proxy = httpProxy.createProxyServer()
      const server = createServer((req,res) => {
        const route = routing.find(route => req.url.startsWith(route.path));

        consulClient.agent.service.list((err,services) => {
          const servers = !err && Object.values(services).filter(service => service.Tags.includes(route.service))

          if(err || !servers.length) {
            res.writeHead(502)
            return res.end('Bad gateway')
          }

          route.index = (route.index + 1) % servers.length;
          const server = servers[route.index]
          const target = `http://${server.Address}:${server.Port}`
          proxy.web(req,res,{target})
        })
      })

      server.listen(8080, () => {
        console.log('Load balancer started on port 8080')
      })
      ```
