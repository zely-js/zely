# Getting Started

## Using tool

You can create zely application easily with [create-zely](https://npmjs.com/package/create-zely).

---

1. Download Template

::: code-group

```bash [npx]
$ npx create-zely
```

```bash [yarn]
$ yarn create zely
```

:::

2. Install Dependencies

::: code-group

```bash [npm]
$ npm install
```

```bash [yarn]
$ yarn
```

:::

3. Run!

::: code-group

```bash [npm]
$ npm dev # start app
```

```bash [yarn]
$ npm dev # start app
```

:::

## Manual Installation

You can also add zely to a project that already exists.

Enter the command below:

::: code-group

```bash [npm]
$ npm install --save-dev zely
```

```bash [yarn]
$ yarn add -D zely
```

:::

Add the configuration file (`zely.config.ts`).

::: code-group

```ts [zely.config.ts]
import { defineConfig } from 'zely/config';

export default defineConfig({
  // options
});
```

:::
