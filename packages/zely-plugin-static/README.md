# @zely-js/static

`@zely-js/static` is a plugin for zely server that serves static files from a specified directory under a given URL prefix.

## Installation

```bash
npm install @zely-js/static
```

## Usage

```ts
import { staticPlugin } from '@zely-js/static';

export default defineConfig({
  plugins: [staticPlugin('/static', './public')],
});
```

- `prefix` (string): URL prefix to serve static files (e.g., `/static`)
- `directory` (string): Local directory path containing static files
