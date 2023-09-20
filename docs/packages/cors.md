# @zely/plugin-cors

## Installation

Install using [npm](https://npmjs.com/package/@zely/plugin-cors):

```bash
npm i --save-dev @zely/plugin-cors
```

## Usage

```ts
// zely.config.ts
import { defineConfig } from 'zely/config';
import cors from '@zely/plugin-cors';

export default defineConfig({
  plugins: [cors.cors()],
});
```

## zely add

If you use `zely add`, you don't have to install and apply plugins cumbersomely.

```bash
zely add cors
```
