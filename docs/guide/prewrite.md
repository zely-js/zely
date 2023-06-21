# Prewrite

`prewrite` helps you customize `res.send`.

::: warning

res.end doesn't support usePrewrite. Use res.send instead.

:::

## Example

It can be used directly in page files, and can also be used in middleware and plugins.

::: code-group

```ts [page]
import { usePrewrite } from 'zely';

export function get(req, res) {
  usePrewrite(res, (data) => {
    return `I love ${data}`;
  });
  res.send('cat'); // I love cat
}
```

```ts [middleware]
import { usePrewrite } from 'zely';

export function TestMiddleware(req, res, next) {
  usePrewrite(res, (data) => {
    return `I love ${data}`;
  });
  next();
}
```

```ts [plugin]
import { usePrewrite } from 'zely';

export function TestPlugin() {
  return {
    name: 'test-plugin',
    server(server) {
      server.use((req, res, next) => {
        usePrewrite(res, (data) => {
          return `I love ${data}`;
        });
        next();
      });
    },
  };
}
```
