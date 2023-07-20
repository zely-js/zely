# Javascript Apis

## Config

### `defineConfig()`

Define config

```ts
require('zely').defineConfig({
  // ...
});
```

### `getConfig()`

Auto detect configuration file and get configuration value.

## Server

### `support()`

Add several zely features to `node:http.incomingMessage/serverResponse`.

- `req.query`, `res.html`, `res.status`, `res.sendFile`, `req.snatch`

```ts
const http = require('http');

http.createServer((req, res) => {
  const { request, response } = require('zely').support(req, res);
  console.log(req.query); // undefined
  console.log(request.query); // {}
});
```

### `usePrewrite()`

> guide: [/guide/prewrite](/guide/prewrite)

`prewrite` helps you customize `res.send`.

```ts
import { usePrewrite } from 'zely';

export function get(req, res) {
  usePrewrite(res, (data) => {
    return `I love ${data}`;
  });
  // res.end('cat'); // cat <= not applied.
  res.send('cat'); // I love cat
}
```

### `snatcher()`

`snatcher` does not fetch data through http, but directly accesses the file and fetch data.

```ts
import { snatcher } from 'zely';

export async function get(req, res) {
  const snatch = snatcher(req, res);
  const { body } = await snatch(`/_PATH_/`, `/_METHOD_/`);
}
```
