# Advanced Recipes

## Asynchronously initialized components

- the reason of the synchronous io apis to be existing in node because they are handy to use for implement initialization tasks. but many lib might not have them
- for instance a db module will only accept api requests after the connection and handshake with db has been done.

  ```ts
  import { EventEmitter } from 'events';
  class DB extends EventEmiteer {
    connected = false;
    connect() {
      //simulate the delat of the connection
      setTimeout(() => {
        this.connected = true;
        this.emit('connected');
      }, 500);
    }

    async query(queryStr) {
      if (!this.connected) throw new Error('Not Connected Yet');
      console.log(`Query executed: ${queryStr}`);
    }
  }
  ```

  - Basically we have 2 ways to solve this issue 1. Local initialization check - make sure the module is initialized before any of apis are invoked, otherwise we wait for initializtion

  ```ts
  import { once } from 'events';
  import { db } from './db.js';
  db.connect();
  async function updateLastAccess() {
    if (!db.connected) await once(db, 'connected');

    await db.query(`INSERT (${Date.now()}) INTO "Last-Accesses"`);
  }
  updateLastAccess();
  setTimeout(() => updateLastAccess, 600);
  ```

  2. Delayed startup

  - delay the execution of any code relying on the asynchronously initialized component until the component has finished its initialization routine.

    ```ts
    import { db } from './db.js';
    import { once } from 'events';
    async function initialize() {
      db.connect();
      await once(db, 'connected');
    }

    async function updateLastAccess() {
      await db.query(`INSERT (${Date.now()}) INTO "Last-Accesses"`);
      initialize().then(() => {
        updateLastAccess();
        setTimeout(updateLastAccess, 600);
      });
    }
    ```

    - with this tech we have to know in advance that the component load order which will be pain in the ass.

  3. pre-initialization queue

     - make sure that the service of a component are invoked only after the component is initialized involves the use of queues and the Command pattern.

     ```ts
     import { EventEmitter } from 'events';
     class DB extends EventEmitter {
       connected = false;
       commandsQueue = [];
       async query(qs) {
         if (!this.connected) {
           console.log('queued');
           return new Promise((res, rej) => {
             const command = () => this.query(qs).then(res, rej);
             this.commandQueue.push(command);
           });
         }
         console.log(`Query executed: ${qs}`);
       }

       connect() {
         setTimeout(() => {
           this.connected = true;
           this.emit('connected');
           this.commandsQueue.forEach(command => command());
           this.commandsQueue = [];
         }, 500);
       }
     }
     ```

  4. pre-initialized queue with state pattern

## async request batching and caching

- batching
  - if we invoke an asynchronous function while there is still another one pending, we can piggyback on the already running operation instead of creating a brand new request.
  - key point: adequate memory management and invalidation strategy.
- cache

  - as soon as the request completes, store its result in the cache

- pattern

  1. batch phase: any request received while the cache is not set will be batch togather, when the req completes, the cache is set. (we can add the expiration)
  2. when cache is finally set, any subsequent req will be served directly from it

  ```ts
  // TransactionId {amount, product}
  import level from 'level';
  import sublevel from 'subleveldown';
  const db = level('example-db');
  const salesDb = sublevel(db, 'sales', {
    valueEncoding: 'json'
  });

  export async function totalSales(product) {
    const now = Date.now();
    let sum = 0;
    const valueStream = salesDb.createValueStream();
    for await (const transaction of valueStream) {
      if (!product || transaction.product === product)
        sum += transaction.amount;
      console.log(`
      totalSales() took: ${Date.now() - now}ms
      `);

      return sum;
    }
  }
  ```

  - promise:
    1. multiple then() listener can be attached to the same promise
    2. the then listner is guaranteed to be invoked only once and it works even if its attached after the promise is already resolved. Moreover, then() is guaranteed to always be invoked asynchronously

  ```ts
  import { totalSales as totalSalesRaw } from './totalSales.js';
  const runningRequests = new Map();
  export function totalSalesBatched(product) {
    if (runningRequests.has(product)) {
      console.log('Batching');
      return runningRequests.get(product);
    }
    const resultPromise = totalSalesRaw(product);
    runningRequests.set(product, resultPromise);
    resultPromise.finally(() => runningRequests.delete(product));
    return resultPromise;
  }

  const CACHE_TTL = 30_000;
  const cache = new Map();
  export function totalSales(product) {
    if (cache.has(product)) {
      console.log('Cache hit');
      return cache.get(product);
    }

    const resultPromise = totalSalesBatched(product);
    cache.set(product, resultPromise);
    resultPromise.then(
      () => {
        setTimeout(() => {
          cache.delete(product);
        }, CACHE_TTL);
      },
      err => {
        cache.delete(product);
        throw err;
      }
    );
    return resultPromise;
  }
  ```

## Canceling async operation

- cancelable function

  ```ts
  import { asyncRoutine } from './asyncRoutine.js';
  import { CancelError } from './cancelError.js';
  async function cancelable(cancelObj) {
    const resA = await asyncRoutine('A');
    console.log(resA);
    if (cancelObj.cancelRequested) {
      throw new CancelError();
    }
    const resB = await asyncRoutine('B');
    if (cancelObj.cancelRequested) {
      throw new CancelError();
    }
    const resC = await asyncRoutine('C');
    console.log(resC);
  }

  const cancelObj = {
    cancelRequested: false
  };
  cancelable(cancelObj).catch(err => {
    if (err instanceof CancelError) {
      return console.log('Function canceled');
    }

    console.error(err);
  });

  setTimeout(() => {
    cancelObj.cancelRequested = true;
  }, 100);

  // or
  function cancelable() {
    let cancelReq = false;
    function cancel() {
      cancelReq = true;
    }
    function cancelWrapeer(func, ...args) {
      if (cancelReq) return Promise.reject(new CancelError());

      return func(...args);
    }
    return {
      cancelWrapeer,
      cancel
    };
  }
  ```

  - generator solution

  ```ts
  import { CancelError } from './cancelError.js';
  export function createAsyncCancelable(generator) {
    return function asyncCancelable(...args) {
      const genObj = generator(...args);
      let cancelReq = false;
      function cancel() {
        cancelReq = true;
      }
      const promise = new Promise((res, rej) => {
        async function nextStep(prevResult) {
          if (cancelReq) {
            return reject(new CancelError());
          }
          if (prevResult.done) {
            return resolve(prevResult.value);
          }
          try {
            nextStep(genObj.next(await prevResult.value));
          } catch (err) {
            try {
              nextStep(genObj.throw(err));
            } catch (err2) {
              reject(err2);
            }
          }
        }
        nextStep({});
      });
      return {
        promise,
        cancel
      };
    };
  }

  const cancelable = createAsyncCancelable(function*() {
    const resA = yield asyncRoutine('A');
    const resB = yield asyncRoutine('B');
    const resC = yield asyncRoutine('C');
  });

  const { promise, cancel } = cancelable;
  promise.catch(err => {
    if (err instanceof CancelError) {
      return console.log('Function canceled');
    }
    console.error(err);
  });

  setTimeout(() => cancel(), 100);
  ```

  - production: module: caf (Cancelable async Flows)
