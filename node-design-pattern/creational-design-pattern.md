# Creational Design Pattern

- Factory

  - why: decouple the creation of an obj from one particular implementation, to only expose the surface area. And the factory is also a mechanism to enforce encapsulation.

  - factory function:

  ```js
  const REGEX_JPEG = /\.jpe?g$/;
  const REGEX_GIF = /\.gif$/;
  const REGEX_PNG = /\.png$/;

  function createImg(name) {
  	if (name.match(REGEX_JPEG)) return new ImageJpeg(name);
  	if (name.match(REGEX_GIF)) return new ImageGif(name);
  	if (name.match(REGEX_PNG)) return new ImagePng(name);
  	throw new Error('Unsupport format');
  }
  ```

  ```ts
  function createPersion(name) {
  	const privateProperties = {}; //private field
  	const person = {
  		setName(name) {
  			if (!name) {
  				throw new Error('A person must have a name');
  			}
  			privateProperties.name = name;
  		},
  		getName() {
  			return privateProperties.name;
  		}
  	};
  	person.setName(name);
  	return person;
  }
  ```

  - Build a simple code profiler

  ```ts
  const noopProfiler = {
  	start() {},
  	end() {}
  };

  class Profiler {
  	constructor(label) {
  		this.label = label;
  		this.lastTime = null;
  	}

  	start() {
  		this.lastTime = process.hrtime();
  	}
  	end() {
  		const diff = process.hrtime(this.lastTime);
  		console.log(
  			`Timer ${this.label} took ${diff[0]} seconds and ${diff[1]} nanosecs`
  		);
  	}
  }

  export function createProfiler(label) {
  	return process.env.NODE_ENV === 'production'
  		? noopProfiler
  		: new Profiler(label);
  }

  //so
  function getAllFactors (intNum) {
    const profiler = createProfiler('finding all factors of ' + intNum)
    profiler.start()
    const factors = []
    for(let facotr = 2; factor <= intNum; factor++>) {
      while((intNumber % factor) === 0) {
        factors.push(factor)
        intNum = intNum / factor
      }
    }
    profiler.end()
    return factors
  }
  ```

- Builder

  - why: simplifies the creation of complex objects by providing a fluent interface, build object step by step

  ```ts
  const myboat = new BoatBuilder().withMotors(2, '1', '2').build();
  class BoatBuilder {
  	withMotors(count, brand, model) {
  		this.hasMotor = true;
  		this.motorCount = count;
  		this.motorBrand = brand;
  		this.motorModel = model;
  		return this;
  	}
  	withSails(count, material, color) {
  		this.Sails = true;
  		this.sailsCount = count;
  		this.sailsMaterial = material;
  		this.sailsColor = color;
  		return this;
  	}
  	hullColor(color) {
  		this.hullColor = color;
  		return this;
  	}
  	withCabin() {
  		this.hasCabin = true;
  		return this;
  	}
  	build() {
  		return new Boat({
  			...this
  		});
  	}
  }

  class Boat {
  	constructor(params: {
  		hasMotor: boolean;
  		motorCount: number;
  		motorBrand: string;
  		motorModel: string;
  		hasSails: boolean;
  		sailsCount: number;
  		sailsMaterial: string;
  		sailsColor: string;
  		hullColor: string;
  		hasCabin: boolean;
  	}) {
  		//...
  	}
  }
  ```

  - general rule:
    1. main objective is to break down a complex ctor into multiple, more readable and more manageable steps
    2. try to create builder methods that can set multiple related parameters at once
    3. decuce and implicitly set parameters based on the values received as input by a setter method
    4. if necessary, builder also should handle the input transformation
  - functional: Currying

    ```ts
    const url = new UrlBuilder()
    	.setProtocol('https')
    	.setAuthentication('user', 'pass')
    	.setHostname('example.com')
    	.build();
    console.log(url.toString());
    export class UrlBuilder {
    	setProtocol(protocol) {
    		this.protocol = protocol;
    		return this;
    	}
    	setAuthentication(username, password) {
    		this.username = username;
    		this.password = password;
    		return this;
    	}
    	setHostname(hostname) {
    		this.hostname = hostname;
    		return this;
    	}
    	setPort(port) {
    		this.port = port;
    		return this;
    	}
    	setPathname(pathname) {
    		this.pathname = pathname;
    		return this;
    	}
    	setSearch(search) {
    		this.search = search;
    		return this;
    	}
    	setHash(hash) {
    		this.hash = hash;
    		return this;
    	}
    	build() {
    		return new Url(this);
    	}
    }

    export class Url {
    	constructor({
    		protocol,
    		username,
    		password,
    		hostname,
    		port,
    		pathname,
    		search,
    		hash
    	}) {
    		this.protocol = protocol;
    		this.username = username;
    		this.password = password;
    		this.hostname = hostname;
    		this.port = port;
    		this.pathname = pathname;
    		this.search = search;
    		this.hash = hash;
    		this.validate();
    	}

    	validate() {
    		if (!this.protocol || !this.hostname)
    			throw new Error('Must specify at least a protocol and a hostname');
    	}

    	toString() {
    		let url = this.protocol + '://';

    		if (this.username && this.password)
    			url += this.username + ':' + this.password + '@';

    		url += this.hostname;

    		if (this.port) url += this.port;

    		if (this.pathname) url += this.pathname;

    		if (this.search) url += this.search;

    		if (this.hash) url += this.hash;

    		return url;
    	}
    }
    ```

  - note:superagent is the builder pattern
    ```ts
    superagent
    	.post('https://location.com')
    	.send({ name: 'a', b: 1 })
    	.set('accept', 'json')
    	.then(resp => {
    		//superagent is not a promise, instead, its a thenable, the then will execute and send the promise
    	});
    ```

- Revealing Constructor (promise is based on this)

  - not gof, only in node and js(privide ability to modify the default behaivor when creation)
  - why: how can we reveal some private functionality of an object only at the moment of objects creation
    1. creating objects that can be modified only at creation time
    2. creating objects whose custom behavior can be defined only at creation time
    3. creating objects that can be ini only once at creation time

  ```ts
  const object = new SomeClass(function executor(revealedMember) {
  	//manipulation code
  });
  ```

  - the revaling constructor pattern is made of 3 fundamental element:
    1. a ctor takes a function as input
    2. the function input called as executor
    3. the executor will be invoked at creation, and the revealed Member will be passed as argument
  - immutable buffer

  ```ts
    const MODIFIER_NAMES = ['swap','write','fill']
    export class ImmutableBuffer {
      constructor (size, executor) {
        const buffer = Buffer.alloc(suze)
        const modifiers = {} // hold all methods that can mutate the buffer
        for(const prop in buffer) {
          if(typepf buffer[prop] !== 'function') continue;
          //trying to identify if the current prop is a methd and is modifierable
          if(MODIFIER_NAMES.some(m => prop.startsWith(m))) {
            modifiers[prop] = buffer[prop].bind(buffer)
          }
          else {
            this[prop] = buffer[prop].bind(buffer)
          }
        }
        executor(modifiers)
      }
    }

    const immr = new ImmutabeBuffer('12312312', ({write}) => write('hello'))
  ```

- singleton

  - why: enforce the presence of only one instance of a class and centralize its access.
    - sharing stateful information
    - optimizing resource usage
    - to synchronize access to resource

- Dependency Injection

  - dependencies of a component are provided as input by an external entity, often referred to as the injector

  ```ts
    import {promisify} from 'util'
    export class Blog {
      constructor (db) {
        this.db = db
        this.dbRun = promisify(db.run.bind(db))
        this.dbAll = promisify(db.all.bind(db))
      }
      initialize () {
        const initQuery = `
          CREATE TABLE
          IF NOT EXISTS
          post (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            create_at TIMESTAMP DEFAULT CURRENT_TIME_STAMP
          );
        `
        return this.dbRun(initQuery)
      }
      createPost(id, title, content,createdAt) {
        return this.dbRun(
          `
          INSERT INTO
          post VALUES (
            ?,?,?,?
          );
          `,
          id, title, content, createdAt
        )
      }
      getAllPosts () {
        return this.dbAll(
          `
          SELECT *
          FROM posts
          ORDER BY created_at DESC
          `
        )
      }
    }

    export function createDb(dbFile) {
      return new sqlite3.Database(dbFile)
    }

    const __dirname = dirname(fileURLToPath(import.meta.url))
    async function main() {
      const db = createDb(join(
        __dirname, 'data.sqlite'
      ))
      const blog = new Blog(db)
      await blog.initialize()
      const posts = await blog.getAllPosts()
      if(posts.length === 0) {
        console.log(
          '
            no posts available. dadasdas
          '
        )
      }
      for (const post of posts) {
        console.log(
          post.title, '-'.repeat(post.title.length),'published on ', new Date(post.created_at).toISOString(), post.content
        )
      }
    }

    main().catch(console.error)
  ```

- Inversion of Control
  - what: allow us to shift the responsibility of wiring the modules of an application to a thrid-party, this entity can be a service locator(component used to retrieve a dependency) or dependency injection container (a system that injects the dependencies into a component based on some metadata specified in the code itself or a configuration file)
