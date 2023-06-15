# Typescript

zely fully supports typescript. Most of tests (while development) were run with typescript. Thus, using typescript is recommended.

## Using [create-zely-app](https://npmjs.com/package/create-zely-app)

```bash
$ npx create-zely-app my-ts-app --with-typescript
```

## Using [create-zely](https://npmjs.com/package/create-zely)

Select Typescript Option

```bash
$ npx create-zely

? Project name: my-app
? Directory: backend
? Template: typescript
```

## Migrantion from Javascript

::: code-group

```ts [page/index.ts]

import { ZelyRequest, ZelyResponse } from 'zely';

module.exports.get = function(req, res) {  // [!code --]
export function get(req: ZelyRequest, res: ZelyResponse) { // [!code ++]

  res.end("I love typescript!");
}
```

:::

rename `zely.config.js` to `zely.config.ts`

::: code-group

```ts [zely.config.ts]
// zely.config.js => zely.config.ts
const { defineConfig } = require('zely'); // [!code --]
module.exports = defineConfig({}); // [!code --]

import { defineConfig } from 'zely'; // [!code ++]
export default defineConfig({}); // [!code ++]
```

:::
