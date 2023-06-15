# Javascript Apis

## Packages

- [zely](https://www.npmjs.com/package/zely) - core package <Badge type="tip" text="stable" />
- [create-zely](https://www.npmjs.com/package/create-zely) - a tool creating prext app <Badge type="tip" text="stable" />

- [prexty](https://www.npmjs.com/package/prexty) - a frontend plugin for prext <Badge type="tip" text="stable" />
- [create-prext-app](https://www.npmjs.com/package/create-prext-app) - <Badge type="danger" text="deprecated" />
- [prext-analyst](https://www.npmjs.com/package/prext-analyst) - <Badge type="danger" text="deprecated" />
- [@prext/plugin-kit](https://www.npmjs.com/package/@prext/plugin-kit) - (applied to prext by default) <Badge type="danger" text="deprecated" />

## `package.exports`

```json
"exports": {
  ".": {
    "require": "./dist/index.js",
    "import": "./dist/index.esm.js",
    "types": "./types/index.d.ts"
  },
  "./config": {
    "require": "./dist/config.js",
    "import": "./dist/config.esm.js",
    "types": "./types/export-config.d.ts"
  },
  "./server": {
    "require": "./dist/server.js",
    "import": "./dist/server.esm.js",
    "types": "./types/export-server.d.ts"
  }
}
```
