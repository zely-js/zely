# Config

## DefineConfig

Create `zely.config.js` or `zely.config.ts` to define config.

1. Default

::: code-group

```ts [zely.config.ts]
export default {};
```

```js [zely.config.js]
module.exports = {};
```

:::

2. Using `defineConfig()`

::: code-group

```ts [zely.config.ts]
import { defineConfig } from 'zely/config';

export default defineConfig({
  /* config */
});
```

```js [zely.config.js]
const { defineConfig } = require('zely/config');

module.exports = defineConfig({
  /* config */
});
```

:::

## Types

### base

- Type: `string`
- Default: `.`

Project root directory. (only relative path)

### routes

- Type: `string`
- Default: `/pages/`

Directory where page files are located.

### middlewares

- Type: `Array<Middleware>`

Middlewares Array

```ts
function example(req, res, next) {
  req.message = 'Hello World';
  next();
}

export default {
  middlewares: [example],
};
```

### port

- Type: `number`
- Default: `5050`

Port

### handler

- Type: `HandlerType`

Custom Server Handler

```ts
await Zely({
  handler: (req, res, routes) => {
    // ...
  },
});
```

### esbuild

- Type: `esbuild.BuildOptions`

Esbuild build option.

### plugins

- Type: `Plugin[]`

::: tip

reference: [plugin](/apis/plugin)

:::

### watch

- Type: `{enable: boolean; options: chokidar.WatchOptions;}`

### error

- Type: `(req: IncomingMessage, res: ServerResponse) => void | Promise<void>;`

### allowAutoMiddlewares

- Type: `boolean`

::: tip

reference: [auto middleware](/guide/middlewares#auto-mode)

:::

### middlewareDirectory

- Type: `string`

### server

```ts
interface Config {
  // ...
  server?: {
    middlewareMode?: boolean;
    // osik server options
    osik?: ServerOptions;
    // if you enable `keepCache`, zely will not remove cache directory when server starts.
    keepCache?: boolean;
  };
}
```

## useBrackets

If you enable `useBrackets`, you can set routes using brackets like `/[id]/index.ts`.
