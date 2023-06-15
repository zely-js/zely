# $page

`$page` variable provides data of page.

Example:

```ts
export const $page = {};
```

## `$page.path`

Provide custom path.

::: code-group

```ts [page/my-about.ts]
export function get(req, res) {
  res.end('About Page');
}

export const $page = {
  path: '/about',
};
```

:::

---

For example, if you want '/pages/api/v1-en-books.ts' to be requested as '/v1/en/books', you can enter it as follows.

```ts
export function get(req, res) {
  res.end('English books (v1)');
}

export const $page = {
  path: '/v1/en/books',
};
```

## `$page.before/after`

A function that is run before/after processing request.

```ts
export const $page = {
  before(req, res) {
    console.log(`new request: ${req.params.slug}`);
  }
  after(req, res) {
    console.log("Done!");
  }
}
```
