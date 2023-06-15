# Plugin Guide

In this chapter, we will create a simple plugin.

## Middleware Plugin

You can apply middlewares or custom handlers using `plugin.server`.

```ts
export function myPlugin() {
  return {
    name: 'my-plugin',

    server(server) {
      server.use((req, res, next) => {
        next();
      });
    },
  };
}
```

## Transform

You can transform files using `plugin.transform`.

::: warning

Files that are converted by default (such as typescript, javascript) will not be called.

:::

`plugin.transform` will return `routes`.

### Concept of Routes

- `file`: path (such as `/`, `/about`, `/foo/bar`)

- `m`: module

```ts
return {
  m: {
    get(req, res) {
      res.end('get');
    },
    post(req, res) {
      res.end('post');
    },
  },
};
```

- `modulePath`: built file directory

[build](/guide/build) feature requires `modulePath`.  
If you don't want to support build feature, you don't have to provide this value.

- `type`: `module` or `html`

### Transform Example

```ts
import { parse } from 'path';

export function myPlugin() {
  return {
    name: 'my-plugin',

    transform(id, code) {
      return {
        file: parse(id).name,
        m: {
          get(req, res) {
            res.end('Hello World!');
          },
        },
        modulePath: '',
        type: 'module', // html or module
      };
    },
  };
}
```
