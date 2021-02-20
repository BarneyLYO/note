# Streams

- buffer: js only got string as the primitive type unlike another language as java to have byte to represent binary datas. a branch of buffer togather can be describe as a blob.

  - size: maximum size of a buffer changes across platform and versions of Nodejs
    ```ts
    import buffer from 'buffer';
    console.log(buffer.constansts.MAX_LENGTH);
    ```
  - use case - gzip with buffer, limited with file less than buffer.constansts.MAX_LENGTH
    ```ts
    import { promises as fs } from 'fs';
    import { gzip } from 'zlib';
    import { promisify } from 'util';
    const gzipPromise = promisify(gzip);
    const filename = process.argv[2];
    async function main() {
    	const data = await fs.readFile(filename);
    	const gzippedData = await gzipPromise(data);
    	await fs.writeFile(`${filename}.gz`, gzippedData);
    	console.log('File successfully compressed');
    }
    main();
    ```
  - but with stream
    ```ts
    import { createReadStream, createWriteStream } from 'fs';
    import { createGzip } from 'zlib';
    const filename = process.argv[2];
    createReadStream(filename)
    	.pipe(createGzip())
    	.pipe(createWriteStream(`${filename}.gz`))
    	.on('finish', () => console.log('file successfully compressed'));
    ```
  - stream is time efficiency, for instance an app that compresses a file and uploads it to a remote http server, which in turn decompresses it and saves in on the filesystem
    Server:

    ```ts
    import { createServer } from 'http';
    import { createWriteStream } from 'fs';
    import { createGunzip } from 'zlib';
    import { basename, join } from 'path';
    const server = createServer((req, res) => {
    	const filename = basename(req.headers['x-file-name']);
    	const destFilename = join('received_files', file - name);
    	console.log(`File request received:${filename}`);
    	req //req is already a stream sub-class
    		.pipe(createGunzip())
    		.pipe(createWriteStream(destFilename))
    		.on('finish', () => {
    			res.writeHead(201, {
    				'Content-Type': 'text/plain'
    			});
    			res.end('OK\n');
    			console.log(`File saved: ${destFilename}`);
    		});
    });
    server.listen(3000, () =>
    	console.log('Listening on http://localhost:3000')
    );
    ```

    Client:

    ```ts
    import { request } from 'http';
    import { createGzip } from 'zlib';
    import { createReadStream } from 'fs';
    import { basename } from 'path';
    const filename = process.argv[2];
    const serverHost = process.argv[3];
    const httpRequestOptions = {
    	hostname: serverHost,
    	port: 3000,
    	path: '/',
    	method: 'PUT',
    	headers: {
    		'Content-Type': 'application/octet-stream',
    		'Content-Encoding': 'gzip',
    		'X-Filename': basename(filename)
    	}
    };
    const req = request(httpRequestOptions, res =>
    	console.log(`Server response: ${res.statusCode}`)
    );

    createReadStream(filename)
    	.pipe(createGzip())
    	.pipe(req) // stream api will maintain the order for us
    	.on('finish', () => console.log('File successsfully sent'));
    ```

  - composability
    streams have a uniform interface and they can understand each other in terms of api, for instance pipe. only prerequisite is that the next stream in the pipeline has to support the data type produced by the previous stream.

    - client side:

      ```ts
      import { createCipheriv, randomBytes } from 'crypto';
      const filename = process.argv[2];
      const serverHost = process.argv[3];
      const secret = Buffer.from(process.argv[4], 'hex');
      const iv = randomBytes(16);
      const httpRequestOptions = {
      	hostname: serverHost,
      	headers: {
      		'Content-Type': 'application/octet-stream',
      		'Content-Encoding': 'gzip',
      		'X-Filename': basename(filename),
      		'X-Initialization-Vector': iv.toString('hex')
      	}
      };
      const req = request(httpRequestOptions, res =>
      	console.log('Server response:' + res.statusCode)
      );

      createReadStream(filename)
      	.pipe(createGzip())
      	.pipe(createCipheriv('aes192', secret, iv))
      	.pipe(req);
      ```

    - server side
      ```ts
      import { createDecipheriv, randomBytes } from 'crypto';
      const secret = randomBytes(24);
      console.log('Generated Secret: ' + secret.toString('hex'));
      const server = createServer((req, res) => {
      	const filename = basename(req.headers['x-file-name']);
      	const iv = Buffer.from(req.headers['x-initialization-vector'], 'hex');
      	const destFilename = join('received_files', filename);
      	console.log('File request received:' + filename);
      	req
      		.pipe(createDecipheriv('aes192', secret, iv))
      		.pipe(createGunzip())
      		.pipe(createWriteStream(destFilename));
      });
      ```
      - iv -> Initialization vector
        is a fixed size input to a cryptographic primitive that is typically required to be random or pseudorandom.

- but wtf is stream

  - anatomy:
    in nodejs, stream can be readable, writeable, duplex or even trasform(stream got those abstract classes there), stream also is the subclass of EventEmitter with event:

    <table>
      <tr>
        <th>type of stream</th>
        <th>meaning</th>
        <th>events</th>
       </tr>
      <tr>
        <td>Readable</td>
        <td>source of data</td>
        <td>end,error</td>
        
      </tr>
      <tr>
        <td>Writeable</td>
        <td>finish,error</td>
      </tr>
      <tr>
        <td>Duplex</td>
        <td>error</td>
      </tr>
      <tr>
        <td>Transform</td>
        <td>error</td>
      </tr>
    <table>
    stream has 2 modes 
      1. binary: to stream data in the form of chunks, such as buffer or strings
      2. object: to stream data as sequence of discrete objects

    - readable: 2 type of receive data:
      - non-flowing(paused):
        1. api: `readable.read([size])`
        2. blocking, synchronously
        3. return a chunk of data represented by buffer
        ```ts
        process.stdin
        	.on('readable', () => {
        		let chunk;
        		console.log('New Data Available');
        		while ((chunk = process.stdin.read()) !== null) {
        			console.log('chunk read' + chunk.length + 'bytes');
        		}
        	})
        	.on('end', () => console.log('End of Stream'));
        ```
      - flowing
        1. how: listen to the data listener
        ```ts
        process.stdin
        	.on('data', chunk => {
        		console.log('new data');
        		console.log('chunk read ' + chunk.toString());
        	})
        	.on('end', () => console.log('end of stream'));
        ```
        2. readable streams are also async iterators
        ```ts
        async function main() {
        	for await (const chunk of process.stdin) {
        		console.log('new data aval');
        		console.log(
        			'chunk read ' + chunk.length + 'bytes ' + chunk.toString()
        		);
        	}
        	console.log('end of stream');
        }
        main();
        ```
    - customized readable stream

      1. requirement: implement `readable._read(size)`
      2. the internal readable class will call `_read()` method, will start fill the internal buffer by using `readable.push(chunk)`

      - example

        ```ts
          import {Readable} from 'stream'
          import Chance from 'chance'
          const chance = new Chance()
          export class RandomStream extends Readable {
            /**
             * opt:{
               encoding: indicate to auto convert buffers into string
               objectMode:enable obj mode
               highWaterMark: upper limit of the data stored in the internal buffer
             }
             */
            constructor(opt) {
              super(opt)
              this.emittedBytes = 0
            }
            _read(size) {
              const chunk = chance.string({length:size})
              this.push(chunk,'utf8') // push to internal buffer
              this.emittedBytes += chunk.length
              if(chance.bool({likelihood: 5}))
                this.push(null) // null for EOF
            }
          }
          const r = new RandomStream()
          r.on('data', chunk => {
            console.log(chunk)
          }).on('end', () => {
            console.log(r.emittedButes)
          })

          const r1 = new Readble({
            read(size) {
              ....
            }

          })
        ```

      3. readable streams from iterables

      - `Readable.from(iterable)`, iterable: generators, iterators, async iterators

      ```ts
      import { Readable } from 'stream';
      const mountains = [
      	{ name: 'Everest', height: 8848 },
      	{ name: 'K2', height: 8611 },
      	{ name: 'Kangchenjunga', height: 8586 },
      	{ name: 'Lhotse', height: 8516 },
      	{ name: 'Makalu', height: 8481 }
      ];
      //readable from auto convert the objectmode to be true by default as long as the objectMode is not specified to be true
      const mountainsStream = Readable.from(mountains);
      mountainsStream.on('data', mountain => {
      	console.log(`${mountain.name.padStart(14)}\t${mountain.height}m`);
      });
      ```

    - writable: data destination

      - `writable.write(chunk, [encoding],[cb])`
      - `writable.end([chunk],[encoding],[cb]) //cb === finish event, fired when flushed into os`
      - example
        ```ts
        import { createServer } from 'http';
        import Chance from 'chance';
        const chance = new Chance();
        const server = createServer((req, res) => {
        	res.writeHead(200, {
        		//not writable interface
        		'Content-Type': 'text/plain'
        	});
        	while (chance.bool({ likelihood: 95 })) {
        		res.write(`${chance.string()}\n`);
        	}
        	res.end('\n\n');
        	res.on('finish', () => console.log('All data sent'));
        });
        server.listen(8080, () =>
        	console.log('listening on http://localhost:8080')
        );
        ```
      - backpressure
        - highWaterMark property: the limit of the internal buffersize, when internal buffer within is full, writable.write will return false to indicate the internal buffer is full
        - drain event: when the buffer is emptied the drain event is emitted, to indicate write can be perform, this mechanism is called backpressure
      - implementing writable streams

        ```ts
        import { Writable } from 'stream';
        import { promises as fs } from 'fs';
        import { dirname } from 'path';
        import { join } from 'path';
        import mkdirp from 'mkdirp-promise';
        export class ToFileStream extends Writable {
        	constructor(opt) {
        		super({ ...opt, objectMode: true });
        	}
        	_write(chunk, encoding, cb) {
        		mkdirp(dirname(chunk.path))
        			.then(() => fs.writeFile(chunk.path, chunk.content))
        			.then(() => cb())
        			.catch(cb);
        	}
        }

        const streamToFile = new ToFileStream();
        streamToFile.write({
        	path: join('files', 'file2.txt'),
        	content: 'hello'
        });
        streamToFile.write({
        	path: join('files', 'file3.txt'),
        	content: 'adasdasd'
        });
        ```

    - duplex streams

      - definition: a duplex stream is a stream that is both readable and writeable. a socket is a good example. readable stream and writable stream are parallel
      - methods: both methods from readable and writable
      - option obj:
        1. allowHalfOpen:default true, one can close, and other can open
        2. readableObjectMode/writableObjectMode

    - Transform streams

      - special kind of duplex stream, designed to handle data transformations. zlib.createGzip() and crypto.createCipheriv() create transform streams for compression and encryption.
      - the readable and writable are piped togather
      - implementation

        ```ts
        import { Transform } from 'stream';
        export class ReplaceStream extends Transform {
        	constructor(searchStr, replaceStr, opts) {
        		super({ ...opts });
        		this.searchStr = searchStr;
        		this.replaceStr = replaceStr;
        		this.tail = '';
        	}

        	_transform(chunk, encoding, cb) {
        		const pieces = (this.tail + chunk).split(this.searchStr);

        		const lastPiece = piece[piece.length - 1];

        		const tailLen = this.searchStr.length - 1;
        		this.tail = lastPiece.slice(-tailLen);
        		pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen);
        		this.push(pieces.join(this.replaceStr)); //push to the readable buffer
        		cb();
        	}
        	_flush(cb) {
        		this.push(this.tail);
        		cb();
        	}
        }
        ```

      - usage: Filtering and aggregating data with Transform streams

        ```ts
        import { createReadStream } from 'fs';
        import parse from 'csv-parse';

        const csvParser = parse({ columns: true });
        createReadStream('data.csv')
        	.pipe(csvParser)
        	.pipe(new FilterByCountry('Italy'))
        	.pipe(new SumProfit())
        	.pipe(process.stdout);

        class FilterByCountry extends Transform {
        	constructor(country, opts = {}) {
        		super({ ...opts, ...{ objectMode: true } });
        		this.country = country;
        	}
        	_transform(record, encode, cb) {
        		record.country === this.country && this.push(record);
        		cb();
        	}
        }

        class SumProfit extends Transform {
        	constructor(opts = {}) {
        		super({ ...opts, ...{ objectMode: true } });
        		this.total = 0;
        	}

        	_transform(record, encode, cb) {
        		this.total += Number.parseFloat(record.profit);
        		cb();
        	}

        	_flush(cb) {
        		this.push(this.total.toString());
        		cb();
        	}
        }
        ```

      - pattern: Streaming aggregation
        use \_transform() to process the data and accumulate the partial result, then call this.push() only in \_flush() method to emit the result when all the data has been processed

    - pass through streams
      special type of Transform that output every data chunk without applying any transformation to the chunk itself but does something with it

      1. observability: you can use a passThrough stream to count how many chunk passed through

      ```ts
      import { PassThrough } from 'stream';
      let bytesWritten = 0;
      const monitor = new PassThrough();
      monitor.on('data', chunk => {
      	bytesWritten += chunk.length;
      });
      monitor.on('finish', () => {
      	console.log(`${bytesWritten} bytes written`);
      });
      monitor.write('Hello!');
      monitor.end();

      createReadStream(filename)
      	.pipe(createGzip())
      	.pipe(monitor)
      	.pipe(createWriteStream(`${filename}.gz`));
      ```

      - usage: late piping

        ```ts
        //image we have an api
        declare function upload(filename, contentStream);

        import { createReadStream } from 'fs';
        import { createBrotliCompress } from 'zlib';
        import { PassThrough } from 'stream';
        import { basename } from 'path';
        /* 
          use pass-through stream as the placeholder
          since the server will not receive anything 
          since we dont put anything into a pass-through
        */
        const endStream = new PassThrough();
        upload('some.jpg', endStream)
        	.then(res => console.log('server res: ' + res.data))
        	.catch(err => {
        		console.error(err);
        		process.exit(1);
        	});
        createReadStream('filename')
        	.pipe(createBrotliCompress())
        	.pipe(endStream);

        function createUploadStreamConnector(filename) {
        	const connector = new PassThrough();
        	upload(filename, connector);
        	return connector;
        }
        ```

    - lazy stream: function like createReadStream will actually open a file descriptor every time a new Stream is created, if we process tons of stream related with os, we might get EMFILE(too many open files), In addtion create a stream is a expensive operation. check the module lazystream, using a proxy to lazy create a stream

    - pipe operation
      - in unix: `exho Hello World! | sed s/World/Node.js/g`
      - in node:
        ```ts
        readable.pipe(writable, [options]);
        ```
      - pipe to stream togather create a suction, allow data to flow automatically and backpressure handled automatically, but the error is not automatically handled.
        ```ts
        stream1
        	.on(error, err => {})
        	.pipe(stream2)
        	.on(error);
        ```
        - solution:`pipeline(stream1,stream2,stream3,...,cb)`
          - code:
            ```ts
            import { createGzip, createGunzip } from 'zlib';
            import { Treansform, pipeline } from 'stream';
            const uppercasify = new Transform({
            	transform(chunk, enc, cb) {
            		this.push(chunk.toString().toUpperCase());
            		cb();
            	}
            });
            pipeline(
            	//pipeline can be promisified
            	process.stdin,
            	createGunzip(),
            	uppercasify,
            	createGzip(),
            	process.stdout,
            	err => {
            		if (err) {
            			console.error(err);
            			process.exit(1);
            		}
            	}
            );
            ```

- async control flow pattern with stream
  - sequential execution
  ```ts
  import {createWriteStream, createReadStream} from 'fs'
  import {Readable,Transform} from 'stream'
  export function concatFiles(dest,files) => {
    const destStream = createWriteStream(dest)
    Readable
      .from(files)
      .pipe(new Transform({
        objectMode:true,
        transform(filename,encode,done) {
          const src = createReadStream(filename)
          src.pipe(destStream, {end:false})
          src.on('error',done)
          src.on('end',done)
        }
      }))
      .on('error',reject)
      .on('finish',() => {
        destStream.end()
        resolve()
      })
  }
  ```
  - piping pattern
    1. combining stream
    - write at first, read from last
    - pipe/pipeline only return last stream, and you dont have the way to attach the stream to the front
    - module to use : pumpify
      ```ts
      //const combinedStream = pumpify(streamA, streamB, streamC)
      import { createGzip, createGunzip } from 'zlib';
      import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';
      import pumpify from 'pumpify';
      function createKey(password) {
      	return scryptSync(password, 'salt', 24);
      }
      export function createCompressAndEncrypt(password, iv) {
      	const key = createKey(password);
      	const combinedStream = pumpify(
      		createGzip(),
      		createCipheriv('aes192', key, iv)
      	);
      	combinedStream.iv = iv;
      	return combinedStream;
      }
      export function createDecryptAndDecompress(password, iv) {
      	const key = createKey(password);
      	return pumpify(createDecipheriv('aes192', key, iv), createGunzip());
      }
      pipeline(
      	createReadStream(source),
      	createCompressAndEncrypt(password, iv),
      	createWriteStream(destination),
      	err => {
      		if (err) {
      			console.error(err);
      			process.exit(1);
      		}
      		console.log(`${destination} created with iv: ${iv.toString('hex')}`);
      	}
      );
      ```
    - Forking streams
      - a single readable stream into multiple writable stream
      ```ts
      import { createReadStream, createWriteStream } from 'fs';
      import { createHash } from 'crypto';
      const filename = process.argv[2];
      const sha1Stream = createHash('sha1').setEncoding('hex');
      const md5Stream = createHash('md5').setEncoding('hex');
      const inputStream = createReadStream(filename);
      inputStream.pipe(sha1Stream).pipe(createWriteStream('file1'));
      inputStream.pipe(md5Stream).pipe(createWriteStream('file2'));
      ```
    - merging streams
      - 1 writable, multi-readable
      ```ts
      import {createReadStream, createWriteStream} from 'fs'
      import split from 'split'
      const dest = process.argv[2]
      const source = process.argv.slice(3)
      const destStream - createWriteStream(dest)
      let endCount = 0
      for(const source of sources) { //multistream
        const sourceStream = createReadStream(
          source, {highWaterMark:16}
        )
        sourceStream.on('end', () => {
          if(++endCount === sources.length) {
            destStream.end()
            console.log(dest + 'created')
          }
        })
        sourceStream
          .pipe(split(line => line " '\n'))
          .pipe(destStream, {end:false})
      }
      ```
