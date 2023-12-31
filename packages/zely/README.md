[![img](https://github.com/zely-js/core/blob/main/.github/assets/icon-v3.svg)](https://github.com/zely-js/core)

# Zely

Build Productive, Convenient, Fast Backend

[**github**](https://github.com/zely-js/core) • [**npm**](https://npmjs.com/package/zely) • [**website**](https://zely.vercel.app/)

## Features

- **🚧 File-based routing.** Prext.js creates routes automatically with filenames.
- **🚀 Server Reload.** You don't have to restart server to apply changes.
- **✅ Typescript Supported.**
- **⚡ Lightning fast.**

## Installation

> [Try it!](https://codesandbox.io/p/github/zely-js/zely-next-starter)

- use create-zely

```sh
> npx create-zely
```

- Manual installation

```sh
> npm install --save-dev zely
```

```ts
// zely.config.ts
import { defineConfig } from 'zely';

export default defineConfig({
  port: 3000,
  routes: '/pages/',
});
```

## Example

Visit [playground](https://github.com/zely-js/core/tree/main/playground)!

## License

MIT
