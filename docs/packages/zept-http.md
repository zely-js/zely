# @zept/http

Inspired by koa, only middleware is supported by default, but the handler of this framework is inspired by express, not koa. The concept of middleware is similar to express.

---

```ts
const { ZeptServer } = require('@zept/http');
const server = new ZeptServer();

server.use((req, res, next) => {
  next();
});

server.listen(3000);
```

## Installation

Install using [npm](https://npmjs.com/package/@zept/http):

```
npm install @zept/http
```

## async/await

zept supports async/await by default.

```ts
app.use(async (req, res, next) => {
  await next();
  console.log('2');
});

app.use(async (req, res) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  console.log('1');

  res.body = 'Hello World!';
});
```

result:

```
$ node index.js
1
2
```

## Processor

`processor` is middleware that runs after all existing middleware has been executed.

```ts
const { ZeptServer } = require('@zept/http');
const server = new ZeptServer();

server.useProcessor((req, res, next) => {
  console.log('processor called');
  next();
});
server.use((req, res, next) => {
  console.log('middleware called');
  next();
});

server.listen(3000);
```
