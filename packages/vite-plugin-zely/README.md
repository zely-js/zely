# vite-plugin-zely

Zely plugin for vite dev server.

[**github**](https://github.com/zely-js/core) • [**npm**](https://npmjs.com/package/zely) • [**website**](https://zely.netlify.app/)

```bash
npm i --save-dev vite zely vite-plugin-zely
```

## Usage

```js
import { defineConfig } from 'vite';
import { vitePluginZely } from 'vite-plugin-zely';

export default defineConfig({
  plugins: [
    vitePluginZely({
      /* options */
    }),
  ],
});
```

## Playground

[/playground/with-vite](https://github.com/zely-js/core/tree/main/playground/with-vite)

## Only development server.

This plugin works only on the development server.
