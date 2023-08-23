# Contributing

First, thank you for your contribution. 🚀🚀  
Zely is a recently created package and is unstable.

## Project Structure

- [`/packages/`](https://github.com/zely-js/core/tree/main/packages): Core Packages Directory

| [zely](https://npmjs.com/package/zely) | [@zely/plugin-cors](https://www.npmjs.com/package/@zely/plugin-cors) | [vite-plugin-zely](https://www.npmjs.com/package/vite-plugin-zely) |
| -------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/packages/zely`                       | `/packages/plugin-cors`                                              | `/packages/vite-plugin-zely`                                       |

- [`/docs/`](https://github.com/zely-js/core/tree/main/docs): Documentation
- [`/playground/`](https://github.com/zely-js/core/tree/main/playground): Examples
- [`/scripts/`](https://github.com/zely-js/core/tree/main/scripts): Scripts for Development

## Contribute

1. Fork and clone [repository](https://github.com/zely-js/core)

```sh
$ git clone https://github.com/zely-js/core.git
$ cd core
```

2. Install dependencies

::: info
[yarn](https://yarnpkg.com/) must be installed.
:::

::: code-group

```sh [npm]
$ npm install
```

```sh [yarn]
$ yarn
```

:::

3. Run examples

::: code-group

```sh [npm]
$ cd ./playground/with-typescript
$ npm run dev
```

```sh [yarn]
$ yarn workspace @playground/with-typescript dev
```

:::

4. Make changes
5. Open a [Pull Request](https://github.com/zely-js/core/pulls)
