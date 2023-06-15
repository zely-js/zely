# Middlewares

## Usage

::: code-group

```ts [middlewares/message.ts]
import { Middleware } from 'zely';

export const Message: Middleware = (req, res, next) => {
  (req as any).message = 'Hello World!';
  next();
};
```

:::

::: code-group

```ts [pages/index.ts]
import { ZelyRequest, ZelyResponse } from 'zely';

export function get(req: ZelyRequest, res: ZelyResponse) {
  res.end((req as any).message);
}
```

:::

### Regists

Add them to `config.middlewares`.

::: code-group

```ts [zely.config.ts]
import { Message } from './middlewares/message';

export default defineConfig({
  middlewares: [Message],
  // ...
});
```

:::

## Auto Mode

::: warning
`autoMiddlewareMode` is a experimental feature.
:::

To use auto middleware mode, edit config value.

::: code-group

```ts [middlewares/message.ts]
import { Middleware } from 'zely';

const Message: Middleware = (req, res, next) => {
  (req as any).message = 'Hello World!';

  next();
};

// export as default

export default Message;
```

:::

::: code-group

```ts [zely.config.ts]
export default defineConfig({
  allowAutoMiddlewares: true,
  middlewareDirectory: 'middlewares',
});
```

:::
