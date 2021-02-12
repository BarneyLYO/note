# Node platform

- The Reactor Pattern: The Node.js asynchronous even-driven architecture is based on the reactor pattern

- Philosophy

  1. small core: node.js runtime and built-in modules having the smallest possible set of functionalities while leaving the reast to the so-called userland(userspace)
  2. small modules: modules is the basic building block for create application and reusable libraries. The most <b>evangelized principles</b> is designing small modules
  3. small suface area: common pattern for defining modules is to expose only once functionality
  4. simplicity and pragmatism: KISS

- how node works

  1. I/O: IO is slow, Blocking I/O is not really good thing.

  - blocking IO:
    ```js
    let data = socket.read(); //blocking, muilt-thread will not solve the problem, because of context switch
    print(data);
    ```
  - non-blocking IO aka busy-waiting(huge amount of wasted CPU time)

    ```js
    let resources = [socketA, socketB, fileA];
    while (!resource.isEmpty()) {
    	for (let resource of resources) {
    		let data = resource.read();
    		if (data === NO_DATA_AVAILABLE)
    			//EAGAIN
    			continue;

    		if (data === RESOURCE_CLOSED) {
    			resources.removeItem(resource);
    		} else {
    			consumeData(data);
    		}
    	}
    }
    ```

  - event demultiplexing: busy-waiting is definitely not an ideal tech for processing non-blocking resources. newer os provide new way of handling concurrent non-blocking resource in an efficient way.<b>synchronous event demultiplexer</b>

    - multiplexing 多路复用: method by which multiple signals are combined into one so they can be easily transmitted over medium with limited capacity.
    - demultiplexing 解多路: signal is split again into its original components

      - The synchronous event demultiplexer: watch multiple resources and return a new event, when read or write operation executed over one of those resource completes.

      ```js
      let watchedList = [];
      watchedList.add({
      	resource: socketA,
      	operation: FOR_READ
      });
      watchedList.add({
      	resource: fileB,
      	operation: FOR_READ
      });

      /* 
          the demultiplexer is set up with the grp of resource to be watched.
          demultiplexer.watch is synchronous and blocks until any of the watched are ready for read.
        */
      while ((events = demultiplexer.watch(watchedList))) {
      	//event loop
      	for (let event of events) {
      		let data = event.resource.read();
      		if (data === RESOURCE_CLOSED) {
      			demultiplexer.unwatch(event.resource);
      		} else {
      			consumeData(data, event.resource);
      		}
      	}
      }
      ```

    - reactor pattern
      ```ts
        interface Event {
          resource: Resource
          operation: Operation
          handler:(data:any,error:Error) => void
        }
        interface EventQueueItem {
          event : CompletedEvent
          handler: (data:any,error:Error) => void
        }
        interface CompletedEvent {
          data:any
          error:Error
        }
        /*
          event queue contains finished IO operation
          1. node application will exit when there are no more pending operations
          2. reactor pattern: Handles I/O by blocking until new events are available from a set of observed resource
        */
        while(const eventQueue = demultiplexer.watch(watchedList)) {
          eventQueue.forEach(({event,handler} : EventQueueItem) => {
              handler.call(null, event.data, event.error)
          })
        }
      ```
    - Libuv and the I/O engine
      event demultiplexer interface for event demultiplexer: epoll on linux, kqueue on MacOs, I/O completion port (IOCP) API on Windows, but regular filesystem files do not support non-blocking operations, so in order to simulate non-blocking behavior, it is necessary to use a separate thread outside the event loop. So we get libuv.

      - Libuv: low-level I/O Engine(Event Loop) of Node.js.

    - The Module System:
      CommonJS: uses require to import functions. variables, classes.
