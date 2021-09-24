# Server And Connection 
## data folder structure
    - data 
      - conf //config 
        - mongod.conf //config file
      - db //database folder
      - log
        - mongodb.log
## boot parameter 
    - bind_ip: binded ip, if 127.0.0.1, only local machine can access
    - logpath: the path to log **file**
    - logappend: use the appending way to add log
    - dbpath: path to db
    - port: default 27017
    - serviceName: name of service
    - serviceDisplayName
    - install

# connection
 - shell: mongo
 - user format: mongodb://admin:123456789@localhost/ 
 |                           format                           |                                       desc                                        |
 | :--------------------------------------------------------: | :-------------------------------------------------------------------------------: |
 |                    mongodb://localhost                     |                                     localhost                                     |
 |              mongodb://fred:foobar@localhost               |                             user:fred/password:foobar                             |
 |            mongodb://fred:foobar@localhost/baz             |                         user and pass connect into baz db                         |
 |      mongodb://example1.com:27017,example2.com:27017       |                              connect to replica pair                              |
 |    mongodb://localhost,localhost:27018,localhost:27019     |                              connect to replica set                               |
 |         mongodb://host1,host2,host3/?slaveOk=true          | connect to replica set, write in the main server, read are districuted into slave |
 |  mongodb://host1,host2,host3/?connect=direct;slaveOk=true  |           direct connect to the first one, no matter is slave or master           |
 |               mongodb://localhost/?safe=true               |                                   safe connect                                    |
 | mongodb://host1,host2,host3/?safe=true;w=2;wtimeoutMS=2000 | safe connect ot replica set, and wait till 2 replica server writed, timeout 2 sec |
