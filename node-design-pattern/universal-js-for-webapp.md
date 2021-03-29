# module bundler

- steps

  1. dependency resolution

  - goal: traversing the codebase, starting from the main module(entry point) and discovering all the dependencies. and resolve all dependencies as an acyclic direct graph, dependency graph
  - example: a fictional calculator

    ```ts
    // 1
    import { calculator } from 'calculator.js';

    // 4
    import { display } from 'display.js';
    display(calculator('2+2.4'));

    export function display() {}

    // 2
    import { parser } from 'parser.js';
    // 3
    import { resolver } from 'resolver.js';

    export function calculator(expr) {
      return resolver(parser(expr));
    }

    export function parser(expr) {}

    export function resolver(tokens) {}
    ```

  - the graph is like following:
    ```js
    const dependency_grp = {
      ['app.js']: {
        ['calculator.js']: {
          ['parser.js']: null,
          ['resolver.js']: null
        },
        ['display.js']: null
      }
    };
    ```
  - if the dependency resolver encounter a same dependency a second time, the dependency will be skipped.
  - by resolving the dependencies, we got modules map, the final output of we need for module bunlder
    ```ts
    const moduleMap = {
      // each module is an factory function which will module export the thing we exported
      'app.js': (module, require) => {
        const { parser } = require('parser.js');
        const { resolver } = require('resolver.js');
        module.exports.calculator = function(expr) {
          return resolver(parser(expr));
        };
      },
      'calculator.js': (module, require) => {},
      'display.js': (module, require) => {},
      'parser.js': (module, require) => {},
      'resolver.js': (module, require) => {}
    };
    ```

  2. packing

  - incharge of bundle module map into exexutable bundle.

    ```ts
    ((moduleMap, entry) => {
      const require = name => {
        const module = { exports: {} };
        modulesMap[name](module, require); // service locator pattern
        return module.exports;
      };
      require(entry); // start from entry point
    })(moduleMap, 'app.js');
    ```

  - cache busting: optimaization technique, file is named by hash, the name of file changes indicates the file content change so we can put asset on cdn with static name.

## Fundamentals of Cross-platform dev

- runtime code branching: yep if else style. or check if we got window as global var.

```ts
  import nunjucks from 'nunjucks'
  const template= `<h1>Hello <i>{{name}}</i></h1>`

  const isBroswer = typeof window !== undefine && window.document;

  export function sayHello (name) {
    return isBroswer ? nunjucks.renderString(template,{{name}}) :  `Hello \u001b[1m${name}\u001b[0m`
  }
```

- con: dead code, size, no dynamic loading,

- build time code branching
  in webpack: define plugin and terser-webpack-plugin

  ```ts
    import nunjucks from 'nunjucks'
    export function sayHello (name) {
      if(typeof __BROSWER__ !== 'undefined') {
          const template= `<h1>Hello <i>{{name}}</i></h1>`
          return nunjucks.renderString(template,{{name}})
      }
      return `Hello \u001b[1m${name}\u001b[0m`;
    }
  ```

  in webpack

  ```ts
  //terser is a minifier module
  const TerserPlugin = require('terser-webpack-plugin');
  module.exports = {
    mode: 'production',
    plugins: [
      new webpack.DefinePlugin({
        __BROSWER__: true
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
    }
  };
  ```

  - cons: too many if right

- module swapping
  have 2 separated implementation of our code, one for server and one for broswer.

  ```ts
  //server side say-hello.js
  import chalk from 'chalk';
  export function sayHello(name) {
    return `Hello ${chalk.green(name)}`;
  }
  //client side say-hello.browswer.js
  import nunjucks from 'nunjucks';
  const template = `<h1>Hello<i>{{name}}</i></h1>`;
  export function sayHello(name) {
    return nunjucks.renderString(template, { name });
  }
  //webpack.config.js
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /src\/say-hello\.js$/,
      path.resolve(__dirname, 'src', 'say-hello.broswer.js')
    )
  ];
  ```

- real life example
  - react hydrate: render html code at server side and then render the broswer once received the html hydrate the code. for all those front end stuff.
