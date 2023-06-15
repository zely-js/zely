# Routing

zely.js automatically generates routes based on your file tree of pages.

```txt
.
├─ pages
│  ├─ user
│  │  └─ $id.ts
│  ├─ users.ts
│  └─ index.ts
├─ zely.config.ts
└─ package.json
```

will be

```json
["/", "/users", "/users/:id"]
```

More examples:

```txt
/pages/index.ts => /
/pages/dashboard.ts => /dashboard
/pages/foo/bar.ts => /foo/bar
/pages/user/$user.ts => /user/:user
```

## Custom Path

If you don't like routes based on filename, just export `$page`!

```ts
export const $page = {
  path: '/foo/bar',
};
```

## Route Parameters

You can access the current page parameters by `req.params`.

::: code-group

```ts [pages/user/$id.ts]
import { ZelyRequest, ZelyResponse } from 'zely';

export function get(req: ZelyRequest, res: ZelyResponse) {
  res.json({ id: req.params.id });
}
```

:::

## Method

Exports functions corresponding `get`, `post`, `delete` etc (http verbs)

```ts
// get
export function get(req, res) {}
// post
export function post(req, res) {}
// etc...
```

### request

Zely Server is based on `node:http` module.

> reference: [http.req](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#request-body)

### req.params

Page Parameters.

- type: `any`
- example: `/item/$id` => `req.params.id`

```js
export function get(req, res) {
  res.end(`item: ${req.params.id}!`);
}
```

### req.query

Page Querystring.

- type: `object`
- example: `/abc?foo=bar` => `req.query.foo`

### response

Zely Server is based on `node:http` module.

> reference: [http.res](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#http-status-code)

### res.json

Send json data.

```js
export function get(req, res) {
  res.json({ id: 1 });
}
```

### res.end

Send data

```js
export function get(req, res) {
  res.end('Hello World!');
}
```

### res.send

Send data

::: info

same as "req.end"

:::

### res.setHeader

Set header

### res.status

Set status

- added: [1.0.0-beta.1](https://github.com/zely-js/core/blob/main/packages/zely/CHANGELOG.md#100-beta1-2023-02-27)

```js
export function get(req, res) {
  res.status(200).end('Hello World!');
}
```

## 404 page

> This Feature has been supported since `v0.1.0`.

You can set 404 page with `config.error`.

```ts
export default defineConfig({
  error(req, res) {
    // ...
  },
});
```

## Parameters in HTML

You cannot access the current page parameters. - ([#1](https://github.com/do4ng/zely/issues/1))
