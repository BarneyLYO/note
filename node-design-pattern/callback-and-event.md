# The Callback & Observer Pattern

> Callbacks are functions that are invoked to propagate the result of an operation, In the asynchronous world callbak is the replace of the use of the return instruction.

- closures

  > closure enables a function to refer to a enviroment which a function was created, function can always maintain the context in which the asynchronous operation was requested, no matter when or where its invoked.

- the continuation-passing style

  > In functional programming, if a callback function is passed into a function as an argument, and invoked when the result is ready --- continuation-passing style(CPS)

  - simple word: result is propagated by passing it to another function
  - synchronous cps
    ```ts
    function add(a, b, cb) {
    	cb(a + b);
    }
    ```
  - asynchronous cps
    ```ts
    function addAsync(a, b, cb) {
    	setTimeout(() => cb(a + b), 100);
    }
    ```
  - pitfalls

    - an unpredictble function aka unleashing zalgo

      > aip behaves synchronously under certain conditions and asynchronously under others

      ```ts
      import { readFile } from 'fs';
      const cache = new Map();
      function inconsistantRead(filename, cb) {
      	if (cache.has(filename))
      		//sync
      		return cb(cache.get(filename));
      	//async
      	return readFile(filename, 'utf8', (err, data) => {
      		cache.set(filename, data);
      		cb(data);
      	});
      }
      ```

      - solution:

        1. sync: always choose a direct style for purely synchronous function, and only use blocking apis sparingly and only when they dont affect the ability of the application to handle concurrent asynchronous operations.

        ```ts
        import { readFileSync } from 'fs';
        const cache = new Map();
        function consistentReadSync(fname) {
        	if (cache.has(fname)) return cache.get(fname);

        	const data = readFileSync(fname, 'utf8');
        	cache.set(fname, data);
        	return data;
        }
        ```

        2. async, guaranteeing asynchronicity with deferred

        ```ts
        import { readFile } from 'fs';
        const cache = new Map();
        function consistentReadAsync(fname, cb) {
        	if (cache.has(fname)) {
        		//nextTick is mircotasks, exe just after the current operation completes, even before any other I/O event is fired
        		return process.nextTick(() => cb(cache.get(fname)));
        	}

        	return readFile(fname, 'utf8', (err, data) => {
        		cache.set(fname, data);
        		cb(data);
        	});
        }
        ```

        - note: setTimeout's cb is queued in an eventloop phase that comes after all I/O events have been processed

  - cb conventions

    ```ts
    function xxxx(arg1, arg2, callback);
    //callback
    (err: Error, result) => {
    	if (err) {
    		return handleErr(err);
    	}
    	return handleResult(result);
    };

    xxx(1, 2, (err, result) => {
    	if (err) {
    		return handleErr(err);
    	}
    	let a;
    	try {
    		/*
          never allow exception to be thrown in event loop,Throwing an error inside an asynchronous callback would cause the error to jump up to the event loop, so it would never be propagated to the next callback. In Node.js, this is an unrecoverable state and the application would simply exit with a non-zero exit code, printing the stack trace to the stderr interface.
        */
    		a = JSON.parse(result);
    	} catch (error) {
    		return handleError;
    	}
    	handle(result);
    });

    //prevent the error to be continue exec
    process.on('uncaughtException', err => {
    	console.error(err);
    	process.exit(1);
    });
    ```

- Observer Pattern

  - def
    > The Observer pattern defines an object(called subject) that can notify a set of observers(or listeners) when change in its state occus
  - implementation in node

    > built into the core and is available through EventEmitter class. EventEmitter allows to register one or more functions as listener, which will be invoked when a particular event type is fired.

    ```ts
    import { EventEmitter } from 'events';
    const emitter = new EventEmitter();
    const listener = (a?: number) => console.log(a + 'eventname');
    emitter.on('eventname', listener).once('eventname', listener);
    emitter.emit('eventname', 1);
    emitter.removeListener('eventname', listener);
    ```

    - practice

      ```ts
      import { EventEmitter } from 'events';
      import { readFile } from 'fs';
      function findRegec(files, regex) {
      	const emitter = new EventEmitter();

      	for (const file of files) {
      		readFile(file, 'utf8', (err, content) => {
      			if (err) {
      				return emitter.emit('error', err);
      			}

      			emitter.emit('file-readed', file);

      			const match = content.match(regex);
      			if (match) {
      				match.forEach(el => emitter.emit('found', file, el));
      			}
      		});
      	}

      	return emitter;
      }
      fileRegex(['fileA.txt', 'fileB.json'], /hello \w+/g)
      	.on('file-readed', console.log)
      	.on('found', (file, el) => console.log(file, el))
      	.on('error', console.error);
      ```

      - error handling: EventEmitter treats the error event in a special way, it will automatically throw an exception and exit from the application if such an event is emitted and no associated listener is found, <b>Always register a listener for the error event</b>

      - class practice

        ```ts
        import { EventEmitter } from 'events';
        import { readFile } from 'fs';
        class FindRegex extends EventEmitter {
        	construtor(regex) {
        		super();
        		this.regex = regex;
        		this.files = [];
        	}
        	addFile(file) {
        		this.files.push(file);
        		return this;
        	}
        	find() {
        		for (const file of this.files) {
        			readFile(file, 'utf8', (err, content) => {
        				if (err) return this.emit('error', err);
        				this.emit('file-read', file);
        				const match = content.match(this.regex);
        				match && match.forEach(el => this.emit('found', file, el));
        			});
        		}
        		return this;
        	}
        }
        ```

- EventEmitter vs Callback

  - callback: should be used when a result must be returned in an asynchronous way
  - events: should be used when there is a need to communicate that something has happened

- combination

  > EventEmitter can be used in conjunction with a callback, callback will be act as the result handler for asynchronously call, and the emitter provide more detailed account on the status of an asynchronous process. great example of glob

  ```ts
  //const eventEmitter = glob(pattern, [options], cb)
  import glob from 'glob';
  glob('data/*.txt', (err, files) => {
  	if (err) return console.error(err);

  	console.log(`All files found: ${JSON.stringify(files)}`);
  }).on('match', match => console.log(`Match found: ${match}`));
  ```

  > emitter is great way for the fetch object's lifecycle function
