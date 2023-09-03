# Zept

zept is a nodejs http library for performance improvement. You can add and remove routes at any time.

---

```js
const { zept } = require('zept');
const routes = [
  {
    path: '/',
    module: (req, res) => {
      res.end('Hello World');
    },
  },
  {
    path: '/book/:id',
    module: (req, res) => {
      res.end(req.params.id);
    },
  },
];

zept(routes).listen(3000);
```

## Installation

Install using [npm](https://npmjs.com/package/zept):

```bash
npm install --save-dev zept
```

## Routes

- `route.path`: express style url path

> ```json
> [
>   {
>     "path": "/"
>   },
>   {
>     "path": "/user/:id"
>   },
>   {
>     "path": "/:foo/:bar/"
>   },
>   {
>     "path": "/a/*"
>   }
> ]
> ```

- `route.module`: function to be executed

### Append/Remove Routes

You can add and delete routes by accessing the array `zept.routes`.

```ts
const app = zept([]);

app.routes.push({
  path: '/',
  module: (req, res) => {},
});
```

## License

MIT
