# Methods

Creating a page that prints `hello world` requires us to write more code than expected.

```ts
export function get(req, res) {
  res.end('Hello, World!');
}
```

In these situations, `methods` can be used to write more concise code.

```ts
export default 'Hello, World!';
```

Not only that, `methods` can be used flexibly in many situations.

## `all`, `get`, `post`...

Just exporting default with nothing responds to all methods. However, if you want to respond only when method is `GET`, you can write the following code.

## Multiple Handlers

If you want some functions to only respond to `GET` and other functions to only respond to `POST`, you can put them in an array.

```ts
import { GET, POST } from 'zely/methods';

export default [
  GET({
    type: 'cat',
    emoji: '🐱',
  }),
  POST({
    type: 'dog',
    emoji: '🐶',
  }),
];
```

::: info
Since `v1.0.2`, it is automatically imported without importing `GET` or `POST` functions.

```ts
// import { GET } from 'zely/methods';
export default GET({});
```

:::

## Access to `req`, `res`

Functions can be used as the body.

```ts
import { POST } from 'zely/methods';

export default [POST((req, res) => {
  res.send(req.body)
}];
```
