const { asto, esbuildLoader } = require('asto');
const { default: nodeExternalsPlugin } = require('esbuild-node-externals');

const repo = (name) => (input, output) => ({
  input: `packages/${name}/src/${input}`,
  output: `packages/${name}/dist/${output}`,
  options: {
    plugins: [
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
};

asto({
  loader: esbuildLoader({
    define: {
      __ESM__: 'false',
    },
  }),
  entryPoints: [
    repos.zely('index', 'index.js'),
    repos.zely('bin/index.ts', 'bin.js'),
    repos.zely('server.ts', 'server.js'),
    repos.zely('export-config.ts', 'config.js'),
    repos.zely('export-methods.ts', 'methods.js'),

    repos.vitePlugin('index.ts', 'index.js'),
  ],
});
