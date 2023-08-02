# Middlewares

The zely is based on the [osik](/apis/osik) aimed at light weight and speed.
Reading the [osik documentation](/apis/osik) will help you understand.

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

## Auto Mode <span><Badge  style="margin-top:6px" text="experimental" /></span>

The auto mode is a feature that loads all files in the middlewares directory and applies them as middleware.  
It has the advantage of not having to change settings to add middleware, but unnecessary files are loaded, which can cause slowdowns.

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

The important point here is that middleware is exported as default.

:::

::: code-group

```ts [zely.config.ts]
export default defineConfig({
  allowAutoMiddlewares: true,
  middlewareDirectory: 'middlewares',
});
```

:::
