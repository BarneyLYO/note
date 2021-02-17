# Async Control Flow Pattern with Promises and Async/Await

- Promise: An Object that carries the status and eventual result of an asynchronous operation

  - state:
    1. pending
       async operation not yet completed
    2. fulfilled
       operation successfully completed
    3. rejected
       operation terminates with error
  - once a promise is change to fulfilled/rejected its considered settled
  - then:
    ```ts
    promise.then(onFulfilled, onRejected);
    ```
    1. then method is that it synchronously returns another promise, moreover if any of the onFulfiled or onRejected function return a value x, the promise returned by the then() method will:
    - fuifill with x if x is a value
    - fulfill with fulfillment value of x if x is a Promise
    - Reject with the eventual rejection reason of x if x is a promise
      if we dont specify an onFulfilled or onRejected handler, the fulfillment value or rejection reason is automatically forwarded to the next promise in the chain
    ```ts
    Promise.resolve(1)
    	.then(result => 2)
    	.then(result => 3)
    	.then(undefined, err => console.error(err));
    ```
  - constructor
    - ```ts
      new Promise((resolve, reject) => {
      	//......
      });
      ```
    - resolve: when invoke will fulfill the promise which will provided fulfillment value
    - reject: reject promise with err, its convention for err to be a instance of Error
  - static method
    1. Promise.resolve(obj): if obj is a thenable, thenable become a promise, if obj is value, obj become a promise contain a value, if obj is a promise, forward the obj
    2. Promise.reject(err): create a Promise that rejects with err as the reason
    3. Promise.all(iterable): create Promise that fulfills with an array of fulfillment value when every item in the imput iterable object fulfills, if any promise in the iterable obj rejects then the promise returned by promise.all will be rejected
    4. Promise.allSettled(iterable): wait till all inputs promises to fulfill or reject and then return an array of objects of fulfilement or rejection
    5. Promise.race(iterable), return a promise that is equivalent to the 1st promise in iterable that settles
  - apis:
    1. then
    2. catch: syntactic sugar for promise.then(undefined, onRejected)
    3. finally(onFinally) : This method allows us to set up an onFinally callback, which is invoked when the Promise is settled (either fulfilled or rejected). Unlike onFulfilled and onRejected, the onFinally callback will not receive any argument as input and any value returned from it will be ignored. The Promise returned by finally will settle with the same fulfillment value or rejection reason of the current Promise instance.
  - usage:
    ```ts
    function delay(ms) {
    	return new Promise((resolve, reject) => {
    		setTimeout(() => {
    			resolve(new Date());
    		}, ms);
    	});
    }
    ```
  - Promisification

    ```ts
    import { randomBytes } from 'crypto';
    function promisify(cbBasedApi) {
    	return function promisified(...args) {
    		const newArgs = [
    			...args,
    			function(err, result) {
    				if (err) return reject(err);
    				return resolve(result);
    			}
    		];
    		cbBasedApi(...newArgs);
    	};
    }

    const randomBytesP = promisify(randomBytes);
    randomBytesP(32).then(buffer => console.log(buffer.toString()));
    ```

    - in real life we would use the promisify() function of util core module to promisify nodejs's callback based function

- sequential execution and iteration

  > Dynamically build a chain of promises using a loop

  - note fs module are promisified by promises object in fs

    ```ts
    import { promises as fsPromises } from 'fs';
    import { dirname } from 'path';
    import superagent from 'superagent';
    import mkdirp from 'mkdirp';
    import { urlToFilename, getPageLinks } from './utils.js';
    import { promisify } from 'util';
    const mkdirpPromises = promisify(mkdirp);
    function download(url, filename) {
    	console.log('Download ' + url);
    	let content;
    	return superagent
    		.get(url)
    		.then(res => {
    			content = res.text;
    			return mkdirpPromises(dirname(filename));
    		})
    		.then(() => fsPromises.writeFile(filename, content))
    		.then(() => {
    			console.log('Downloaded and saved:' + url);
    			return content;
    		});
    }

    function spiderLinks(currentUrl, content, nesting) {
    	let promise = Promise.resolve();
    	if (nesting === 0) return promise;
    	const links = getPageLinks(currentUrl, content);
    	for (const link of links) {
    		promise = promise.then(() => spider(link, nesting - 1));
    	}
    	return promise;
    }

    function spider(url, nesting) {
    	const filename = urlToFilename(url);
    	return fsPromises
    		.readFile(filename, 'utf8')
    		.catch(err => {
    			if (err.code !== 'ENOENT') throw err;
    			return download(url, filename);
    		})
    		.then(content => spiderLinks(url, content, nesting));
    }
    ```

    - advanced sequential iteration pattern
      ```ts
      const promise = tasks.reduce(
      	(prev, task) => prev.then(() => task()),
      	Promise.resolve()
      );
      ```

- Parallel execution
  > all you need is promise.all
  ```ts
  function spiderLinks(currentUrl, content, nesting) {
  	if (!nesting) return Promise.resolve();
  	const links = getPageLinks(currentUrl, content);
  	const promises = links.map(link => spider(link, nesting - 1));
  	return Promise.all(promises);
  }
  ```
- Limited Parallel execution

  ```ts
  import { EventEmitter } from 'events';
  export class TaskQueue extends EventEmitter {
  	constructor(concurrency) {
  		this.concurrency = concurrency;
  		this.running = 0;
  		this.queue = [];
  	}

  	next() {
  		if (this.running === 0 && this.queue.length === 0) {
  			return this.emit('empty');
  		}
  		while (this.running < this.concurrency && this.queue.length) {
  			const task = this.queue.shift();
  			task().finally(() => {
  				this.running--;
  				this.next();
  			});
  			this.running++;
  		}
  	}
  	runTask(task) {
  		return new Promise((resolve, reject) => {
  			this.queue.push(() => task().then(resolve, reject));
  			process.nextTick(this.next.bind(this));
  		});
  	}
  }

  function spiderLinks(currentUrl, content, nesting, queue) {
  	if (!nesting) return Promise.resolve();
  	const links = getPageLinks(currentUrl, content);
  	const promises = links.map(link => spiderTask(link, nesting - 1, queue));
  	return Promise.all(promises);
  }

  const spidering = new Set();
  function spiderTask(url, nesting, queue) {
  	if (spidering.has(url)) return Promise.resolve();
  	spidering.add(url);
  	const filename = urlToFilename(url);
  	return queue.runTask(() =>
  		fsPromises
  			.readFile(filename, 'utf8')
  			.catch(err => {
  				if (err.code !== 'ENOENT') throw err;
  				return download(url, filename);
  			})
  			.then(content => spiderLinks(url, content, nesting, queue))
  	);
  }
  export function spider(url, nesting, concurrency) {
  	const queue = new TaskQueue(concurrency);
  	return spiderTask(url, nesting, queue);
  }
  ```

- Async/Await

  > An async function is a special type of function in which its possible to use the await expression to pause the execution on a given Promise until it resolves.

  ```ts
  async function delay() {
  	console.log('Delaying', new Date());
  	const dateAfterOneSec = await delay(1000);
  	console.log(dateAfterOneSec);
  	const dateAfterThreeSec = await delay(3000);
  	console.log(dateAfterThreeSec);
  	return 'done';
  }
  ```

  - await: value after will be Promise.resolve(val)
  - async: convert returned value into promise
  - sequential exe and iteration

    ```ts
    async function download(url, filename) {
    	console.log('download' + url);
    	const { text: content } = await superagent.get(url);
    	await mkdirpPromises(dirname(filename));
    	await fsPromises.writeFile(filename, content);
    	console.log('download and saved ' + url);
    	return content;
    }

    async function spiderLinks(currentUrl, content, nesting) {
    	if (!nesting) return;
    	const links = getPageLinks(currentUrl, content);
    	for (const link of links) await spider(link, nesting - 1);
    }

    export async function spider(url, nesting) {
    	const filename = urlToFileName(url);
    	let content;
    	try {
    		content = await fsPromises.readFile(filename, 'utf8');
    	} catch (err) {
    		if (err.code !== 'ENOENT') throw err;
    		content = await download(url, filename);
    	}
    	return spiderLinks(url, content, nesting);
    }
    ```

    - parallel execution
      ```ts
      async function spiderLinks(currentUrl, content, nesting) {
      	if (nesting === 0) return;
      	const links = getPageLinks(currentUrl, content);
      	const promises = links.map(link => spider(link, nesting - 1));
      	return Promise.all(promises);
      	//for(const promise of promises) await promise
      }
      ```
