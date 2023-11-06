const { nodeExternalsPlugin } = require('esbuild-node-externals');
const esbuild = require('./asto.esbuild');
const { loader } = require('./asto.webpack');

const repo = (name) => (input, output) => ({
  input: `packages/${name}/src/${input}`,
  output: `packages/${name}/dist/${output}`,
  options: {
    plugins:
      process.env.NODE_ENV === 'production'
        ? []
        : [
            nodeExternalsPlugin({
              packagePath: `packages/${name}/package.json`,
              devDependencies: true,
            }),
          ],
  },
});

const repos = {
  zely: repo('zely'),
  vitePlugin: repo('vite-plugin-zely'),
  builder: repo('zely-builder'),
};

const entryPoints = [
  // zely
  repos.zely('index.ts', 'index.js'),
  repos.zely('server.ts', 'server.js'),
  repos.zely('export-config.ts', 'config.js'),
  repos.zely('export-methods.ts', 'methods.js'),

  // vite plugin zely
  repos.vitePlugin('index.ts', 'index.js'),

  repos.builder('index.ts', 'index.js'),
];

module.exports =
  process.env.NODE_ENV === 'production'
    ? [
        {
          // core packages
          loader: loader(),

          entryPoints,
        },
        {
          // cli
          loader: loader(true),
          entryPoints: [repos.zely('bin/index.ts', 'bin.js')],
        },
      ]
    : [
        {
          // core packages
          loader: esbuild,

          entryPoints,
        },
        {
          // cli
          loader: esbuild,
          entryPoints: [repos.zely('bin/index.ts', 'bin.js')],
        },
      ];
