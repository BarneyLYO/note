# Structural Design Pattern

- Summary

  1. proxy: allow control access to another object
  2. decorator: augment the behavior of an existing object dynamically
  3. adapter: access the functionality of an object using a differenct interface

- Proxy (surrogate)

  - what: a obj controls access to another object called subject.
  - how: the proxy and the subject have the common interface for transparently access from outside
  - usage:
    1. data validation: the proxy validates the input before forwarding it to the subject
    2. security: the proxy verifies that the client is authorized to perform the operation, and it passes the request to the subject only if the outcome of the check is positive
    3. caching: the proxy can keeps the internal cache so the proxied operations are executed on the subject only if the data is not yet present in the cache
    4. lazy initialization: proxy can delay the object creation until its really necessary
    5. logging: proxy intercepts the method invocations and the relative parameters, recoding them as they happen
    6. remote obj: proxy can take a remote object and make it appear local
  - implementation: when proxying an obj. we can decide to intercept all of its methods or only some of them, while delegating the rest directly to the subject.

    - object composition

    ```ts
    class StackCalculator {
    	constructor() {
    		this.stack = [];
    	}
    	putVal(val) {
    		this.stack.push(val);
    	}
    	getVal() {
    		return this.stack.pop();
    	}
    	peekVal() {
    		return this.stack[this.stack.length - 1];
    	}
    	clear() {
    		this.stack = [];
    	}
    	divide() {
    		const divisor = this.getVal();
    		const dividend = this.getVal();
    		const result = dividend / divisor;
    		this.putVal(result);
    		return result;
    	}
    	multiply() {
    		const multiplicand = this.getVal();
    		const multiplier = this.getVal();
    		const result = multiplicand * multiplier;
    		this.putVal(result);
    		return result;
    	}
    }
    //object composition. we can also use function we can use delegates modules too
    class SafeCalculatorProxy {
    	constructor(calculator) {
    		this.calculator = calculator;
    	}
    	//proxied method
    	divide() {
    		const divisor = this.calculator.peekVal();
    		if (divisor === 0) throw Error('Division by 0');
    		return this.calculator.divide();
    	}
    	//following is the delegated methods
    	putVal(val) {
    		const calculator = this.calculator;
    		calculator.stack.push(val);
    	}
    	getVal() {
    		const calculator = this.calculator;
    		return calculator.stack.pop();
    	}
    	peekVal() {
    		const calculator = this.calculator;
    		return calculator.stack[this.stack.length - 1];
    	}
    	clear() {
    		const calculator = this.calculator;
    		calculator.stack = [];
    	}

    	multiply() {
    		const calculator = this.calculator;
    		return calculator.multiply();
    	}
    }
    ```

    - object augmentation(monkey patching)

      - directly modifying the subject directly by replacing a method with its proxied implementation

      ```ts
      function patchToSafeCalculator(calculator) {
      	const fn_divide_origin = calculator.divide;
      	calculator.divide = () => {
      		const divisor = calculator.peekValue();
      		if (divisor === 0) {
      			throw Error('Division by 0');
      		}
      		return fn_divide_orgin.apply(calculator);
      	};
      	return calculator;
      }
      ```

      - issue: dangerous, mutate the object/prototype direcly, solution is built-in proxy object

    - built-in Proxy object

      - es2015
      - proxy ctor accepts a target and a handler
        ```ts
        const proxy = new Proxy(target, handler);
        ```
        - target: subject object
        - handler: behavior of proxy, contains a series of optional methods with predefined name called trap methods like: apply, get, set, has.
        ```ts
        const safeCalculatorHandler = {
        	get: (target, property) => {
        		if (property === 'divide') {
        			return function() {
        				const divisor = target.peekVal();
        				if (divisor === 0) throw Error('Division by 0');
        				return target.divide();
        			};
        		}
        		return target[property];
        	}
        };
        ```
        - note: proxy object inherits the prototype of the subject, so proxy instanceof target === true
        - creating a logging writable stream
        ```ts
        export function createLoggingWritable(writable) {
        	return new Proxy(writable, {
        		get(target, propkey, receiver) {
        			if (propkey === 'write') {
        				return function(...args) {
        					const [chunk] = args;
        					console.log('writing', chunk);
        					return writable.write(...args);
        				};
        			}
        			return target[propkey];
        		}
        	});
        }
        ```
      - change observer with proxy

        - what: the subject notifies one or more observers of any state changes, so that they can react to changes as soon as they happned

        ```ts
        export function createObservable(target, observer) {
        	const observable = new Proxy(target, {
        		set(obj, prop, value) {
        			if (value !== obj[prop]) {
        				const prev = obj[prop];
        				obj[prop] = value;
        				observer({
        					prop,
        					prev,
        					curr: value
        				});
        			}
        			return true;
        		}
        	});
        	return observable;
        }
        function calculateTotal(invoice) {
        	const { subtotal, discount, tax } = invoice;
        	return subtotal - discount + tax;
        }

        const invoice = {
        	subtotal: 100,
        	discount: 10,
        	tax: 20
        };
        let total = calculateTotal(invoice);
        console.log(`starting total ${total}`);
        const obsInvoice = createObservable(invoice, ({ prop, prev, curr }) => {
        	total = calculateTotal(invoice);
        	console.log(`TOTAL:${total} (${prop} changed: ${prev} -> ${curr}`);
        });
        ```

- Decorator

  - what: dynamically augmenting the behavior of an existing object.
  - implementation:
    - composition:
    ```ts
    class EnhancedCalculator {
    	constructor(calculator) {
    		this.calculator = calculator;
    	}
    	add() {
    		const calculator = this.calculator;
    		const add1 = this.getVal();
    		const add2 = this.getVal();
    		const result = add1 + add2;
    		this.putVal(result);
    		return result;
    	}
    	//....delegated methods
    }
    ```
    - obj augmentation
    ```ts
    function patchCalculator(calculator) {
    	calculator.add = function() {
    		const add1 = calculator.getVal();
    		const add2 = calculator.getVal();
    		const result = add1 + add2;
    		calculator.putVal(result);
    		return result;
    	};
    	return calculator;
    }
    ```
    - proxy
    ```ts
    const enhancedCalculatorHandler = {
    	get(target, property) {
    		if (property === 'add') {
    			return function add() {
    				const add1 = target.getVal();
    				const add2 = target.getVal();
    				const result = add1 + add2;
    				target.putVal(result);
    				return result;
    			};
    		}
    	}
    };
    ```

- LevelUP database

  ```ts
  export function levelSubscribe(db) {
  	db.subscribe = (pattern, listener) => {
  		db.on('put', (k, v) => {
  			const match = Object.keys(pattern).every(k => pattern[k] === v[k]);
  			if (match) {
  				listener(k, v);
  			}
  		});
  	};
  	return db;
  }
  ```

- Adapter

  - what: coverts an object with a given interface so that it can be used in a context where a different interface is expected
  - roles:
    - adapter: the adapter which will adapt the adaptee
    - adaptee: the original object
  - implementation:

    - example on fs adapt levelup db

    ```ts
    import { resolve } from 'path';
    export function createFsAdapter(db) {
    	return {
    		readFile(filename, opt, cb) {
    			if (typeof opt === 'function') {
    				cb = opt;
    				opt = {};
    			} else if (typeof opt === 'string') {
    				opt = { encoding: opt };
    			}
    			db.get(
    				resolve(filename),
    				{
    					valueEncoding: opt.encoding
    				},
    				(err, v) => {
    					if (err && err.type === 'NotFoundError') {
    						err = new Error(`ENOENT, open "${filename}"`);
    						err.code = 'ENOENT';
    						err.errno = 34;
    						err.path = filename;
    						return cb && cb(err);
    					}

    					if (err) return cb && cb(err);

    					cb && cb(null, value);
    				}
    			);
    		},
    		writeFile(filename, contents, opt, cb) {
    			if (typeof opt === 'function') {
    				cb = opt;
    				opt = {};
    			} else if (typeof opt === 'string') {
    				opt = { encoding: opt };
    			}
    			db.put(
    				resolve(filename),
    				contents,
    				{
    					valueEncoding: opt.encoding
    				},
    				cb
    			);
    		}
    	};
    }
    ```
