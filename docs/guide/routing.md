# Routing

zely.js automatically generates routes based on your file tree of pages.

| filename             | result(path)      |
| -------------------- | ----------------- |
| `/index.ts`          | `/`               |
| `/hello.ts`          | `/hello`          |
| `/foo/bar.ts`        | `/foo/bar`        |
| `/user/$id.ts`       | `/user/:id`       |
| `/user/$id/about.ts` | `/user/:id/about` |

::: info

You can also use [nextjs style routes](#routes-using-brackets).

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

## Export default <span><Badge  style="margin-top:6px" text="experimental" /></span>

You can write simpler code that outputs the same result since [`v1.0`](/blog/2023-07-23).

::: code-group

```ts [export default]
import { ServerDataHandler } from 'zely';
import { GET, POST } from 'zely/methods';

export default [
  // simple usage
  GET({ foo: 'bar' }),
  // access to req and res
  POST((req, res) => ({
    id: req.params.id;
  })),
] as ServerDataHandler[];
```

```ts [export]
import { ZelyRequest, ZelyResponse } from 'zely';

export function get(req: ZelyRequest, res: ZelyResponse) {
  res.json({ foo: 'bar' });
}

export function post(req: ZelyRequest, res: ZelyResponse) {
  res.json({ id: req.params.id });
}
```

:::

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

## Routes using Brackets <span><Badge  style="margin-top:6px" text="experimental" /></span>

If you don't like zely routes style you can use nextjs routes style.

::: code-group

```ts [zely.config.ts] {4}
import { defineConfig } from 'zely';

export default defineConfig({
  useBrackets: true,
});
```

:::

Examples:

| filename              | result(path)      |
| --------------------- | ----------------- |
| `/index.ts`           | `/`               |
| `/hello.ts`           | `/hello`          |
| `/foo/bar.ts`         | `/foo/bar`        |
| `/user/[id].ts`       | `/user/:id`       |
| `/user/[id]/about.ts` | `/user/:id/about` |
| `/foo/[...bar]`       | `/foo/:bar*`      |

## Custom Path

If you don't like routes based on filename, just export `$page`!

```ts
export const $page = {
  path: '/foo/bar',
};
```

## 404 page

You can set 404 page with `config.error`.

```ts
export default defineConfig({
  error(req, res) {
    // ...
    res.status(404).end('page not found');
  },
});
```

## request and response

Zely Server is based on `node:http` module.

### request

> reference: [http.req](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#request-body)

### response

> reference: [http.res](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#http-status-code)
