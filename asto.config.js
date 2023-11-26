const { esmLoader } = require('@asto/esm');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const esbuild = require('./asto.esbuild');
const { parse, join } = require('path');

const repo =
  (name) =>
  (input, output, esm = false) => {
    /**
     * @type {import("asto").EntryPointOptions[]}
     */
    const out = [
      {
        input: `packages/${name}/src/${input}`,
        output: `packages/${name}/dist/${output}`,
        /**
         * @type {import("esbuild").BuildOptions}
         */
        options: {
          define: {
            __ESM__: 'false',
          },
          logLevel: 'error',

          plugins: [
            nodeExternalsPlugin({
              packagePath: `packages/${name}/package.json`,
            }),
          ],
        },
      },
    ];

    if (esm) {
      const parsed = parse(`packages/${name}/dist/${output}`);

      out.push({
        ...out[0],
        output: join(parsed.dir, `${parsed.name}.mjs`),
        options: {
          ...out[0].options,
          format: 'esm',
          define: {
            __ESM__: 'true',
          },
          banner: {
            js: [
              'import{createRequire}from"node:module";',
              'import{fileURLToPath}from"node:url";',
              'var __filename=fileURLToPath(import.meta.url);',
              'var __dirname=fileURLToPath(new URL(".", import.meta.url));',
              'var require=createRequire(import.meta.url);',
            ].join(''),
          },
        },
      });
    }

    return out;
  };

const repos = {
  zely: repo('zely'),
  vitePlugin: repo('vite-plugin-zely'),
  builder: repo('zely-builder'),
};

const entryPoints = [
  // zely
  ...repos.zely('index.ts', 'index.js', true),
  ...repos.zely('server.ts', 'server.js', true),
  ...repos.zely('export-config.ts', 'config.js', true),
  ...repos.zely('export-methods.ts', 'methods.js', true),

  // vite plugin zely
  ...repos.vitePlugin('index.ts', 'index.js'),

  ...repos.builder('index.ts', 'index.js', true),
];

module.exports = [
  {
    // core packages
    loader: esbuild,

    entryPoints,
  },
  {
    // cli
    loader: esbuild,
    entryPoints: [...repos.zely('bin/index.ts', 'bin.js', true)],
  },
];
