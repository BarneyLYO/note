# Behavioral Design Pattern

- what: how do i change the the behavior of an object/function/etc at runtime

1. Strategy: change parts of a component to adapt it to specific needs
2. State: change behavior of a component based on its state
3. Iterator: common interface to iterate over a collection
4. Middleware: define a modular chain of processing steps
5. Command: materializes the information required to execute a route, allowing such information to be easily transferred, stored, and processed

- Strategy

  - what: enable a object called context to support variations in its logic by extracting the variable parts into seperate, interchangeable objects called strategies.
    - context: implements the common logic of a family of algorithms
    - strategies: implements the mutable parts, allowing the context to adapt its behavior depending on different factores(arguments/system config/user preferences).

  ```ts
  import { promises as fs } from 'fs';
  import objectPath from 'object-path';
  export class Config {
    constructor(formatStrategy) {
      this.data = {};
      this.formatStrategy = formatStrategy;
    }
    get(configPath) {
      return objectPath.get(this.data, configPath);
    }
    set(configPath, value) {
      return objectPath.set(this.data, configPath, value);
    }
    async load(filePath) {
      console.log(`Deserializing from ${filePath}`);
      this.data = this.formatStrategy.deserialize(
        await fs.readFile(filePath, 'utf-8')
      );
    }
    async save(filePath) {
      console.log(`Serializing to ${filePath}`);
      await fs.writeFile(filePath, this.formateStrategy.serialize(this.data));
    }
  }

  import ini from 'ini';
  export const iniStrategy = {
    deserialize: data => ini.parse(data),
    serialize: data => ini.stringify(data)
  };
  export const jsonStrategy = {
    deserialize: data => JSON.parse(data),
    serialize: data => JSON.stringify(data, null, '')
  };

  async function main() {
    const iniConfig = new Config(iniStrategy);
    await iniConfig.load('samples/conf.ini');
    iniConfig.set('book.nodejs', 'design patterns');
    await iniConfig.save('samples/conf.json');
  }
  ```

- State

  - what: specialization of the Strategy pattern where the strategy changes depending on the state of context.
  - truth: state pattern is a form of strategy pattern which is dynamically changed during the lifetime of the context
  - state transition:
    1. by the context object
    2. by the state object itself \*, state machine
    3. client code

  ```ts
  import { OfflineState } from './offlineState.js';
  import { OnlineState } from './onlineState.js';
  import jsonOverTcp from 'json-over-tcp-2';
  export class FailSafeSocket {
    constructor(options) {
      this.options = options;
      this.queue = [];
      this.currentState = null;
      this.socket = null;
      this.states = {
        offline: new OfflineState(this),
        online: new OnlineState(this)
      };
      this.changeState('offline');
    }
    changeState(state) {
      console.log('Activating state${state}');
      this.currentState = this.states[state];
      this.currentState.activate();
    }
    send(data) {
      this.currentState.send(data);
    }
  }

  export class OfflineState {
    constructor(failsafeSocket) {
      this.failsafeSocket = failsafeSocket;
    }

    send(data) {
      this.failsafeSocket.queue.push(data);
    }
    activate() {
      const retry = () => {
        setTimeout(() => this.activate(), 1000);
      };
      this.failsafeSocket.socket = jsonOverTcp.connect(
        this.failsafeSocket.options,
        () => {
          console.log('Connection established');
          this.failsafeSocket.socket.removeListener('error', retry);
          this.failsafeSocket.changeState('online');
        }
      );
      this.failsafeSocket.socket.once('error', retry);
    }
  }

  export class OnlineState {
    constructor(failsafeSocket) {
      this.failsafeSocket = failsafeSocket;
      this.hasDisconnected = false;
    }
    send(data) {
      this.failsafeSocket.queue.push(data);
      this._safeWrite(data);
    }
    _safeWrite(data) {
      this.failsafeSocket.socket.write(
        data,
        err =>
          !err && !this.hasDisconnected && this.failsafeSocket.queue.shift()
      );
    }
    activate() {
      this.hasDisconnected = false;
      for (const data of this.failsafeSocket.queue) {
        this._safeWrite(data);
      }
      this.failsafeSocket.socket.once('error', () => {
        this.hasDisconnected = true;
        this.failsafeSocket.changeState('offine');
      });
    }
  }
  ```

- template

  - what: define an abstract class that implement the skeleton of a component, subclasses will have to fill the gaps in the component by implementing the missing parts(template method)

  ```ts
  import { promises as fsPromises } from 'fs';
  import objectPath from 'object-path';
  export class ConfigTemplate {
    async load(file) {
      console.log(`Deserializing from ${file}`);
      this.data = this._deserialize(await fsPromises.readFile(file, 'utf-8'));
    }
    async save(file) {
      console.log(`Serializing to ${file}`);
      await fsPromises.writeFile(file, this._serialize(this.data));
    }
    get(path) {
      return objectPath.get(this.data, path);
    }
    set(path, value) {
      return objectPath.set(this.data, path, value);
    }
    _serialize() {
      throw new Error('_serialize() must be implemented');
    }
    _deserialize() {
      throw new Error('_deserialize() must be implemented');
    }
  }

  class JsonConfig extends ConfigTemplate {
    _deserialize(data) {
      return JSON.parse(data);
    }
    _serialize(data) {
      return JSON.stringify(data, null, '');
    }
  }
  ```

- Iterator

  - what: Provide common interface or protocol for iterating the elements of a container.
  - protocol: if a obj has `[Symbol.iterator]:{next(){}}` is iterable aka has @@iterator method

    ```ts
      [Symbol.iterator](){
        next() {
          if(more_to_iterate) return {done:false, value:getNextVal(this)}
          return {
            done: true,
            value:return_value_of_exe_iterator || undefine
          }
        }
      }
      const A_CHAR_CODE = 65;
      const Z_CHAR_CODE = 90;
      function createAlphabetIterator () {
        let currCode = A_CHAR_CODE;
        return {
          next() {
            if(currCode <= Z_CHAR_CODE) {
              currCode++;
              const currChar = String.fromCodePoint(currCode)
              return {value:currChar, done:false}
            }
            return {done:true}
          }
        }
      }
      const iterator = createAlphabetIterator()
      let result = iterator.next()
      while(!result.done()) {
        console.log(result.value)
        result = iterator.next()
      }

      export class Matrix {
        constructor (inMatrix) {
          this.data = inMatrix
        }
        get (row, column) {
          if(row >= this.data.length || column >= this.data[row].length) {
            throw new RangeError('Out of bounds')
          }
          return this.data[row][column]
        }
        set (row,column,value) {
          if(row >= this.data.length || column >= this.data[row].length) {
            throw new RangeError('out of bounds')
          }
          this.data[row][column] = value
        }
        [Symbol.iterator] () {
          let nextRow = 0
          let nextCol = 0
          return {
            next:() => {
              if(nextRow === this.data.length) {
                return {done:true}
              }
              const currVal = this.data[nextRow][nextCol]
              if(nextCol == this.data[nextRow].length - 1) {
                nextRow++
                nextCol = 0
              }
              else {
                nextCol++
              }
              return {value: currVal}
            }
          }
        }
      }
    ```

  - iterable: works for for of,`[...iteratable]`
  - api support iteratable:
    1. Map([ k-v iterable])
    2. WeakMap([ k-v iterable ])
    3. Set ([v iterable])
    4. WeakSet([ v iterable ])
    5. Promise.all( iterable )
    6. Promise.race( iterable )
    7. Array.from ( iterable )
    8. stream.Readable.from( iterable, [ options ])
  - Array dont have duplicate
    ```ts
    const arr_with_duplicated = [1, 1, 1, 1, 5];
    const unique_arr = Array.from(new Set(arr_with_duplicated));
    //or
    const super_unique = [...new Set(arr_with_duplicated)];
    ```

- Generator aka semicoroutines

  - a function can be suspended(yield) and then resumed at later time
  - the generator object returned by a generator function is an iterator and iterable
  - execute a generator function will not execute the body instead it will return a generator object.

    - only when execute next() on a generator object, the start/resume the execution of the generator.
    - yield xxx === return {done:false, value:xxx} in iterator

    ```ts
    function* fruitGenerator() {
      yield 'peach';
      yield 'watermelon';
      yield 'summer';
    }
    const fruitGeneratorObj = fruitGenerator();
    console.log(fruitGeneratorObj.next()); // {value:'peach', done:false}
    console.log(fruitGeneratorObj.next());
    console.log(fruitGeneratorObj.next()); //{value:'summer',done:true}
    for (const fruit of fruitGenerator) {
      console.log(fruit); //return value is not print
    }
    ```

  - controlling a generator

    - generator's next can pass in argument

    ```ts
    function* twoWayGenerator() {
      const what = yield null;
      yield 'Hello ' + what;
    }
    const generator = twoWayGenerator();
    generator.next(); // until yield
    console.log(generator.next('a')); //back to yield point
    ```

  - extra feature

    - throw(): behaves like next(), but will throw an exeception in generator, the generator will throw the exception at the last yield point and returns the iterator obj with done and value
    - return(returnArgument?): force the generator to return {
      done:true,
      value:returnArgument
      }

    ```ts
    function* twoWayGenerator() {
      try {
        const what = yield null;
        yield 'Hello ' + what;
      } catch (err) {
        yield 'hello error ' + err.message;
      }
    }
    const a = twoWatGenerator();
    a.next();
    a.throw(new Error('a')); // {value:'hello error a', done:false}
    a.return(123123); //{value:123123, done: true}

    export class Matrix {
      *[Symbol.iterator]() {
        let nextRow = 0;
        let nextCol = 0;
        while (nextRow != this.data.length) {
          yield this.data[nextRow][nextCol];
          if (nextCol == this.data[nextRow].length - 1) {
            nextRow++;
            nextCol = 0;
          } else {
            nextCol++;
          }
        }
      }
    }
    ```

- Async iterators

  - async iterables are objects that implement an @@asyncIterator method or a method accessible through the Symbol.asyncIterator key, which returns (synchronously) an async iterator
  - use for await ...of syntax, syntax suger for:

    ```ts
    const asyncIterator = iterable[Symbol.asyncIterator]();
    let iterationResult = await asyncIterator.next();
    while (!iterationResult.done) {
      console.log(iterationResult.value);
      iterationResult = await asyncIterator.next();
    }
    ```

    - works for all iterator

    ```ts
    import superagent from 'superagent'
    export class CheckUrls {
      constructor (urls) {
        this.urls = urls
      }
      [Symbol.asyncIterator]() {
        //array also implement iterator
        const urlIterator = this.urls[Symbol.iterator]()
        return {
          async next() {
            const iteratorResult = urlIterator.next()
            if(iteratorResult.done) return {done:true}
            const url = iteratorResult.value
            try {
              const checkResult = await superagent.head(url).redirects(2)
              return {
                done:false,
                value:`${url} is up, status ${checkResult.status}`
              }
            }catch(err) {
              return {
                done:false,
                value:`${url} is down, error: ${err.message}`
              }
            }
          }
        }
      }
    }

    async funtion main () {
      const checkUrls = new CheckUrls([
        'https://nodejsdesignpatterns.com',
        'https://example.com',
        'https://mustbedownforsurehopefully.com
      ])
      for await (const status of checkUrls) {
        console.log(status)
      }
    }
    main()
    ```

- Async Generators

  - `async function* generatorFunction() {}`

  ```ts
  export class CheckUrls {
    constructor(urls) {
      this.urls = urls;
    }
    async *[Symbol.asyncIterator]() {
      for (const url of this.urls) {
        try {
          const checkResult = await superagent.head(url).redirects(2);
          yield `${url} is up, status:${checkResult.status}`;
        } catch (err) {
          yield `${url} is down, error ${err.message}`;
        }
      }
    }
  }
  ```

- stream with async iterator

  ```ts
  import split from 'split2';
  async function main() {
    const stream = process.stdin.pipe(split());
    for await (const line of stream) {
      console.log(`you wrote: ${line}`);
    }
  }
  main();
  ```

- stream vs itrator:
  - stream: push model, data is pushed into the internal buffers, process binary data,
  - async iterator:pull, unless another logic is explicity implemented by iterator

* Middleware

  - Express Middleware: `function (req,res,next)`
  - pattern: Intercepting Filter/ Chain of Responsibility => functionaly pipeline
  - describe:
    - use function will be the interface provided by
      middleware manager to register the middleware
    - the registered middleware is invoked in an asynchronous sequential execution flow. Each unit in pipeline receives the result the execution of the previous unit as input result = f(f(x))
    - each middleware can decide to stop further processing data in nodejs invoke the next function, or propagating an error, an error situation usually triggers the execution of another sequence of middleware.
  - data modification:
    1. augmenting the data
    2. maintaining the immutability of the data and augmenting on copy of it.
  - implementation

  ```js
  export class ZmpMiddlewareManager {
    constructor(socket) {
      this.socket = socket;
      this.inboundMiddleware = [];
      this.outboundMiddleware = [];
      this.handleIncomingMessages().catch(console.error);
    }

    async handleIncomingMessages() {
      for await (const [message] of this.socket) {
        await this.executeMiddleware(this.inboundMiddleware, message).catch(e =>
          console.error('Error while processing the message', err)
        );
      }
    }

    async send(msg) {
      const finalMsg = await this.executeMiddleware(
        this.outboundMiddleware,
        msg
      );
      return this.socket.send(finalMsg);
    }

    use(middleware) {
      if (middleware.inbound) {
        this.inboundMiddleware.push(middleware.inbound);
      }
      if (middleware.outbound) {
        this.outboundMiddleware.unshift(middleware.outbound);
      }
    }

    async executeMiddleware(middlewares, initialMsg) {
      let msg = initialMsg;
      for await (const middlewareFunc of middlewares) {
        msg = await middlewareFunc.call(this, message);
      }
      return msg;
    }
  }

  export const jsonMiddleware = () => ({
    inbound(msg) {
      return JSON.parse(message.toString());
    },
    outbound(msg) {
      return Buffer.from(JSON.stringify(msg));
    }
  });

  import { inflateRaw, deflateRaw } from 'zlib';
  import { promisify } from 'util';
  const inflateRawAsync = promisify(inflateRaw);
  const deflateRawAsync = promisify(deflateRaw);
  export const zlibMiddleware = function() {
    return {
      inbound(message) {
        return inflateRawAsync(buffer.from(message));
      },
      outbound(message) {
        return deflateRawAsync(message);
      }
    };
  };

  import zeromq from 'zeromq';
  async function main() {
    const socket = new zeromq.Reply();
    await socket.bind('tcp://127.0.0.1:5000');
    const zmqm = new ZmqMiddlewareManager(socket);
    zmqm.use(zlibMiddleware());
    zmqm.use(jsonMiddleware());
    zmqm.use({
      async inbound(message) {
        console.log('received', message);
        if (message.action === 'ping') {
          await this.send({
            action: 'pong',
            echo: message.echo
          });
        }
        return message;
      }
    });

    console.log('Server Started');
  }

  main();

  //client
  async function main() {
    const socket = new zeromq.Request();
    await socket.connect('tcp://127.0.0.1:5000');
    const zmqm = new ZmqMiddlewareManager(socket);
    zmqm.use(zlibMiddleware());
    zmqm.use(jsonMiddleware());
    zmqm.use({
      inbound(message) {
        consoel.log('Echoed back', message);
        return message;
      }
    });
    setInterval(() => {
      zmqm.send({ action: 'ping', echo: Date.now() }).catch(console.error);
    }, 1000);
    console.log('client connected');
  }
  ```

  - Command

    - def: create an object representing the intention to perform a method or function call/invokation directly, It will then be the responsibility of another component to materialize the intent.
    - roles:
      1. Command: Object encapsulating the information necessary to invoke a method or function
      2. Client: component that creates the command and provides it to the invoker
      3. Invoker is the component responsible for executing the command on the target
      4. Target (or receiver) is the subject of the invocation
    - application
      1. scheduled for execution at any time
      2. RPC
      3. record history
      4. cancelable
      5. mutiplexer
      6. OT
    - Task Pattern

      ```js
        function createTask (tgt,...args) {
          return () => {
            tgt (...args) {
              // .......
            }
          }
        }
      ```

      - advanced:

        ```js
        //target
        const statusUpdates = new Map();
        export const statusUpdateService = {
          postUpdate(status) {
            let id = Math.floor(Math.random() * 100000);
            while (statusUpdates.has(id)) {
              id = Math.floor(Math.random() * 100000);
            }
            statusUpdates.set(id, status);
            console.log(`status posted ${status}`);
            return id;
          },
          destroyUpdate(id) {
            statusUpdates.delete(id);
            console.log(`Status removed ${id}`);
          }
        };

        export function createPostStatusCmd(service, status) {
          let postId = null;
          const cmd = Object.create(null, {});
          cmd.run = () => {
            postId = service.postUpdate(status);
          };
          cmd.undo = () => {
            if (postId) {
              service.destroyUpdate(postId);
              postId = null;
            }
          };
          cmd.serialize = () => ({
            type: 'status',
            action: 'post',
            status: status
          });

          return cmd;
        }

        import superagent from 'superagent';
        export class Invoker {
          constructor() {
            this.histoy = [];
          }
          run(cmd) {
            this.history.push(cmd);
            cmd.run();
            console.log(`Command executed`, cmd.serialize());
          }
          revert() {
            const cmd = this.history.pop();
            cmd.undo();
            console.log(`Command undone`, cmd.serialize());
          }
          delay(cmd, delatyMs) {
            setTimeout(() => {
              console.log(`Executing delayed command`, cmd.serialize());
              this.run(cmd);
            }, delay);
          }
        }

        class remoteInvoker extends Invoker {
          constructor() {
            super();
          }
          async run(cmd) {
            await superagent
              .post('http://localhost:3000/cmd')
              .send({ json: cmd.serialize() });
            console.log(`Command executed remotely`, cmd.serialize());
          }
        }
        const cmd = createPostStatusCmd(statusUpdateService, 'Hi');
        ```
