# Asynchronous Control Flow Pattern with Callbacks

> In this chapter we are going to create a small cli application as web spider.

- dep:

  1. superagent: a lib to streamline http calls
  2. mkdirp: utility to create dir recursively

```ts
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename } from './utils.js';

//cb hell and overlapping variable names
export function spider(url, cb) {
	const filename = urlToFilename(url);
	fs.access(filename, err => {
		if (err && err.code === 'ENOENT') {
			console.log(`Downloading ${url} into ${filename}`);

			superagent.get(url).end((err, res) => {
				if (err) return cb(err);

				mkdirp(path.dirname(filename), err => {
					if (err) return cb(err);
					fs.writeFile(filename, res.text, err => {
						if (err) return cb(err);
						cb(null, filename, true);
					});
				});
			});
		} else {
			return cb(null, filename, false);
		}
	});
}
```

- callback hell aka pyramid of doom: the above code contains pitfalls called callback hell, too many indentation.

- callback best practices and control flow patterns

  - discipline
    1. exit as soon as possible, use return,continue,break wisely<b>early return principle</b>, the return value of asynchronous function is usually ignored
    2. create named function pure function as callbacks.
    3. modularize the code

- refactor

  ```ts
  function saveFile(filename, contents, cb) {
  	mkdirp(path.dirname(filename), err => {
  		if (err) return cb(err);
  		fs.writeFile(filename, contents, cb);
  	});
  }

  function download(url, filename, cb) {
  	console.log(`Downloading ${url}`);
  	superagent.get(url).end((err, res) => {
  		if (err) return cb(err);

  		saveFile(filename, res.text, err => {
  			if (err) return cb(err);
  			console.log(`Downloaded and saved: ${url}`);
  			cb(null, res.text);
  		});
  	});
  }

  export function spider(url, cb) {
  	const filename = urlToFilename(url);
  	fs.access(filename, err => {
  		if (!err || err.code !== 'ENOENT') return cb(null, filename, false);

  		download(url, filename, err => {
  			if (err) return cb(err);
  			cb(null, filename, true);
  		});
  	});
  }
  ```

- sequential execution

  - categories:

    1. Exec a set of known tasks in sequence, without propagating data access them

    ```ts
    function task1(cb) {
    	asyncOperation(() => task2(cb));
    }
    function task2(cb) {
    	asyncOperation(() => task3(cb));
    }
    function task3(cb) {
    	//finally exec the callback
    	asyncOperation(() => cb());
    }
    ```

    2. Using the output of a task as the input for the next(chain, pipeline, waterfall)
    3. Iterating over a collection while running an <b>asynchronous task</b> on each element, one after another.

- web spider version 2

  ```ts
  const spidering = new Set();
  export function spider(url, nesting, cb) {
  	if (spidering.has(url)) return process.nextTick(cb);
  	spidering.add(url);
  	const filename = urlToFilename(url);
  	fs.readFile(filename, 'utf8', (err, fileContent) => {
  		if (err) {
  			if (err.code !== 'ENOENT') return cb(err);
  			//file donrsn't exist, so lets download it
  			return download(url, filename, (err, requestContent) => {
  				if (err) return cb(err);
  				spiderLinks(url, requestContent, nesting, cb);
  			});
  		}
  		spiderLinks(url, fileContent, nesting, cb);
  	});
  }

  function spiderLinks(currentURL, body, nesting, cb) {
  	if (nesting === 0) return process.nextTick(cb);

  	const links = getPageLinks(currentURL, body);
  	if (links.length === 0) return process.nextTick(cb);

  	function iterate(index) {
  		if (index === links.length) {
  			return cb();
  		}
  		spider(links[index], nesting - 1, err => {
  			if (err) return cb(err);
  			iterate(index + 1);
  		});
  	}

  	iterate(0);
  }

  const url = process.argv[2];
  const nesting = Number.parseInt(process.argv[3], 10) || 1;
  spider(url, nesting, err => {
  	if (err) {
  		console.error(err);
  		process.exit(1);
  	}
  	console.log('download finished');
  });
  ```

- The Sequential Iterator pattern

  > Execute a list of tasks in sequence by creating a function named iterator,which invokes the next available task in the collection and make sure to invoke the next step of the iteration when the current task completes

  ```ts
  function iterate(index) {
  	if (index === tasks.length) return finish();
  	const task = task[index];
  	task(() => iterate(index + 1));
  }

  function finish() {}
  iterate(0);

  /*
    collection => actual data set for iterate over
    iteratorCallback => function to execute over collection
    finalCallback => function that gets executed when all items are processed or incase of error
  */
  function iterateSeries(collection, iteratorCallback, finalCallback) {
  	function iterate(index) {
  		if (index === collection.length) return finalCallback();
  		const item = collection[index];
  		iteratorCallback(item, err => {
  			if (err) return finalCallback(err);
  			iterate(index + 1);
  		});
  	}
  	iterate(0);
  }
  ```

- parallel execution

  > the order of execution of a set of async tasks in not important, and all we want is to be notified when all running tasks are completed

  - web spider version 3

    ```ts
    function spiderLinks(currentUrl, body, nesting, cb) {
    	if (!nesting) return process.nextTick(cb);

    	const links = getPageLinks(currentUrl, body);
    	if (!links.length) return process.nextTick(cb);

    	let completed = 0;
    	let hasError = false;
    	function done(err) {
    		if (err) {
    			hasError = true;
    			return cb(err);
    		}
    		if (++completed === links.length && !hasError) return cb();
    	}
    	links.forEach(link => spider(link, nesting - 1, done));
    }
    ```

  - pattern:
    > run a set of asynchronous tasks in parallel by launching them all at once and then wait for all of them to complete by counting the number of times their callbacks are invoked
    ```ts
    const tasks = [];
    let completed = 0;
    tasks.forEach(task =>
    	task(() => {
    		if (++completed === task.length) {
    			finish();
    		}
    	})
    );
    function finish() {}
    ```

- queue

  ```ts
  import { EventEmitter } from 'events';
  export class TaskQueue extends EventEmitter {
  	constructor(concurrency) {
  		this.concurrency = concurrency;
  		this.running = 0;
  		this.queue = [];
  	}
  	pushTask(task) {
  		this.queue.push(task);
  		process.nextTick(this.next.bind(this));
  		return this;
  	}
  	next() {
  		if (this.running === 0 && this.queue.length === 0) {
  			return this.emit('empty');
  		}
  		while (this.running < this.concurrency && this.queue.length) {
  			const task = this.queue.shift();
  			task(err => {
  				if (err) {
  					this.emit('error', err);
  				}
  				this.running--;
  				process.nextTick(this.next.bind(this));
  			});
  			this.running++;
  		}
  	}
  }

  function spiderTask(url, nesting, queue, cb) {
  	const filename = urlToFilename(url);
  	fs.readFile(filename, 'utf8', (err, fileContent) => {
  		if (err) {
  			if (err.code !== 'ENOENT') return cb(err);
  			return download(url, filename, (err, requestContent) => {
  				if (err) return cb(err);
  				spiderLinks(url, requestContent, nesting, queue);
  				return cb();
  			});
  		}
  		spiderLinks(url, fileContnent, nesting, queue);
  		return cb();
  	});
  }

  function spiderLinks(currentUrl, body, nesting, queue) {
  	if (!nesting) return;
  	const links = getPageLinks(currentUrl, body);
  	if (!links.lenght) return;
  	links.forEach(link => spider(link, nesting - 1, queue));
  }

  const spidering = new Set();
  export function spider(url, nesting, queue) {
  	if (spidering.has(url)) return;
  	spidering.add(url);
  	queue.pushTask(done => spiderTask(url, nesting, queue, done));
  }
  ```

- library to look at: <a href="https://caolan.github.io/async/v3/">async</a>
