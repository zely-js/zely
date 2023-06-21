# Frameworks

If you want to use zely with other frameworks, use `middleware`.

```ts {4,5,6}
const zely = require('zely');

const middleware = await zely.middleware({
  server: {
    middlewareMode: true,
  },
});
```

## Example - express

Let's take an example with express:

> example: playground - [/playground/with-express](https://github.com/zely-js/core/tree/main/playground/with-express)

```ts
const express = require('express');
const zely = require('zely');

async function createServer() {
  const middleware = await zely.middleware({
    server: {
      middlewareMode: true,
    },
  });

  const app = express();

  app.use(middleware);

  app.listen(3000, () => {
    zely.showListen(3000);
  });
}

createServer();
```
