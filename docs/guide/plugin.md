# Plugin Guide

> See [plugin documentation](/apis/plugin) for more information.

## Simple Plugin

::: code-group

```ts [plugins/simple.ts]
import { Plugin } from 'zely';

export function SimplePlugin(): Plugin {
  return {
    name: 'simple-plugin',
  };
}
```

:::

::: code-group

```ts [zely.config.ts]
import { defineConfig } from 'zely/config';
import { SimplePlugin } from './plugins/simple';

export default defineConfig({
  plugins: [SimplePlugin()],
});
```

:::

## Transform Plugin

```ts
export function MyPlugin(): Plugin {
  return {
    name: 'my-plugin',

    transform(id, code) {
      // id: file name
      // code: source

      return {
        // path
        // like /about, /user/hello
        file: parse(id).name,

        /*
          module.
          See - https://zely.netlify.app/guide/routing
        */
        m: {
          get(req, res) {
            res.end('Hello World!');
          },
        },
        /* 
          "build" feature requires modulePath. 
          If you don't want to support build feature, you don't have to provide this value.
        */
        modulePath: '',
        type: 'module', // html or js
      };
    },
  };
}
```

## Server Plugin

You can apply middlewares or custom handlers.

```ts
export function MyPlugin(): Plugin {
  return {
    name: 'my-plugin',

    server(server) {
      // middleware
      server.use((req, res, next) => {
        next();
      });
    },
  };
}
```
