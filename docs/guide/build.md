# Build

You can export your backend application!

Although you didn't install dependencies or removed pages by mistake, you can start server with this feature.

This feature creates a ready-to-run javascript file like an executable (such as `exe`).

## Before Build

You have to update configure file (`zely.config.js` or `zely.config.ts`).
::: code-group

```ts [zely.config.ts]
import { defineConfig } from 'zely'; // [!code --]
import { defineConfig } from 'zely/config'; // [!code ++]
```

:::

This step helps reduce the size of the output.

## Usage

Run:

```bash
$ zely export
```

will create `dist/index.js`. And check if it works well.

```bash
$ node dist/index.js
```

Then, remove `node_modules` and `pages`!

```bash
$ rimraf node_modules
$ rimraf pages
```

Check again if it works.

```bash
$ node dist/index.js
```

## CLI

```txt
$ zely export -h
```
