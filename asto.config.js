const { esmLoader } = require('@asto/esm');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const esbuild = require('./asto.esbuild');

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
              devDependencies: false,
            }),
          ],
        },
      },
    ];

    return out;
  };

const repos = {
  zely: repo('zely'),
  vitePlugin: repo('vite-plugin-zely'),
  builder: repo('zely-builder'),
};

const entryPoints = [
  // zely
  ...repos.zely('index.ts', 'index.js'),
  ...repos.zely('server.ts', 'server.js'),
  ...repos.zely('export-config.ts', 'config.js'),
  ...repos.zely('export-methods.ts', 'methods.js'),

  // vite plugin zely
  ...repos.vitePlugin('index.ts', 'index.js'),

  ...repos.builder('index.ts', 'index.js'),
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
    entryPoints: [...repos.zely('bin/index.ts', 'bin.js')],
  },
  {
    loader: esmLoader(),
    entryPoints: [
      // zely
      {
        input: './packages/zely/dist/config.js',
      },
      {
        input: './packages/zely/dist/index.js',
      },
      {
        input: './packages/zely/dist/methods.js',
      },
      {
        input: './packages/zely/dist/server.js',
      },
      // @zely/builder
      {
        input: './packages/zely-builder/dist/index.js',
      },
    ],
  },
];
