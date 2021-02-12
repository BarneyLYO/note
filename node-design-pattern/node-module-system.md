# Node Module System:

> One of the Biggest problems with js in the broswer is the lack of namespacing.

- modules:

  - def: modules are the bricks for structuring non-trivial applications.
  - why:

    1. having a way to split the codebase into multiple files
    2. allowing code resue across different project
    3. encapsulation
    4. manage dependencies

  - revealing module pattern

    ```js
    /*
        use IIFE to simulate the module, only return public accessable stuff to outside. 
        because of closure we get internal state saved
      */
    const myModule = (() => {
    	const privateFoo = () => {};
    	const privateBar = [];
    	const exported = {
    		publicStuff: () => {}
    	};
    })();

    console.log(myModule);
    // {publicStuff}
    ```

  - common js:

    - concept:
      1. require: a function that allows user to import a module from local filesystem
      2. exports/module.exports: special variables that can be used to export public functionality from the current module
    - copy cat version:

      ```js
      function loadModule(filename, module, require) {
      	// revealing module pattern
      	const wrappedSrc = `(
            function (module, exports,require) {
              ${fs.readFileSync(filename, 'utf-8')}
            }
          )(module,module.exports, require)
          `;
      	eval(wrappedSrc);
      }

      function require(moduleName) {
      	/*
            moduleName === full path of the module
          */
      	const id = require.resolve(moduleName);
      	if (require.cache[id]) return require.cache[id].exports;

      	/*
            difference between exports and module.exports is exports only pointed to the module.exports, and any assignment to module.exports must be synchronous
          */
      	const module = {
      		exports: {},
      		id
      	};

      	require.cache[id] = module;
      	/*
      
          */
      	loadModule(id, module, require);

      	/*
          
          */
      	return module.exports;
      }

      require.cache = {};
      /*
          resolve the module in case of dependency hell
          categories:
          1. if moduleName starts with /, so its considered as absolute path to the module, if starts with ./ so its relative path, calculated starting from dir of require module
          2. if modules names is not path, search from core Node.js Modules from require(modules).builtinModules
          3. if not core module found, check current dir's node_modules, and then upper level's node_modules and so on so force
        */
      require.resolve = moduleName => {};
      ```

    - caveats: circular dependencies -> cjs depending on the order in which those dependencies are loaded. While both the modules are completely initialized as soon as they are required, but the true execution states can't be reached.
    - module definition patterns:

      1. Named Exports: module.exports = the namespace of the module

      ```js
      //module a
      exports.a = () => {};
      exports.b = () => {};
      //module b
      const xxx = require('module-a');
      xxx.a();
      xxx.b;
      ```

      2. Exporting Function(substack pattern perfact demonstrate the single-responsibility principle):

      ```js
      module.exports = exports = msg => console.log(msg);

      exports.addtionFunctionality = msg => msg + '1';
      ```

      3. Exporting a class: fucking java way
      4. Exporting an instance: Axios, since the module is cached, every module that requires the logger module will actually always retrieve the same instance of the obj, Singleton
      5. never modify other modules or global scope: Monky patching(unless testing??? see nock)

  - ESM: static moduler system, top of file, no modification, read only

    - use in node: suffix as mjs or package.json with type as module
    - use: export/import
    - import types:

      1. namespace import: import \* as namespace from 'xxx.js' (in common js, suffix is must)
      2. partial import: import {xxx} from 'ad.js'
      3. default import: import x from 'x.js'
      4. mixed import: import x,{a} from 'k.js'

      - best practise: default exports might make it harder to apply dead code elimination (tree shaking). For example, a module could provide only a default export, which is an object where all the functionality is exposed as properties of such an object. “generally considered good practice to stick with named exports, especially when you want to expose more than one functionality, and only use default exports if it's one clear functionality you want to export.”

      - async import: import() -> Async imports can be performed at runtime using the special import() operator. The import() operator is syntactically equivalent to a function that takes a module identifier as an argument and it returns a promise that resolves to a module object

      ```js
      //en.js
      export const HELLO = 'Hello';
      //zh.js
      export const HELLO = '你好';
      //es.js
      export const HELLO = 'Hola';

      //main.js
      const SUPPORTED_LANGS = ['en', 'zh', 'es'];
      const selected = process.argv[2];

      if (!SUPPORTED_LANGS.includes(selected)) {
      	console.error('I dont speak that language');
      	process.exit(1);
      }

      const filePath = selected + '.js';
      import(filePath).then(({ HELLO }) => console.log(HELLO));
      ```

    - read only:

      ```js
      //counter
      export let count = 0;
      export function increment() {
      	count++;
      }
      //main
      import { count, increment } from 'counter.js';
      console.log(count); //0
      increment();
      console.log(count); //1
      count++; // typeerror
      ```

    - in depth:
      1. Loading Phase: build a graph of all necessary modules(dep graph -> directed grp):
      - entry point: find all import statement recursively in dep-first fashion, with 3 phase:
        1. Construction(parse): Find all the imports and recursively load the content of every module from the respective file
        2. Instantiation: For every exported entity, keep named ref in memory, but dont assign any value yet, also ref are created for all the import and export statements tracking the dependency relationship between them(linking)
        3. Evaluation: execute the code so that all the prev instantiated entities can get an actual val
    - diff:
      1. ESM runs in strict mode
      2. missing reference in ESM(modules.export, export, require), use import.meta insteads(**filename, **dirname)
      3. ESM this in global scope is undefine, in cjs this === exports
      4. interoperability
      ```js
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
      const data = require('./data.json');
      console.log(data);
      ```
