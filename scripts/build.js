/* eslint-disable function-paren-newline */
const { asto } = require('asto');
const { webpackLoader } = require('@asto/webpack');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const repo = (name) => (input, output) => ({
  input: `packages/${name}/src/${input}`,
  output: `packages/${name}/dist/${output}`,
  options: {
    plugins: [],
  },
});

const repos = {
  zely: repo('zely'),
  vitePlugin: repo('vite-plugin-zely'),
};

const webpackPlugins = [
  new webpack.DefinePlugin({
    __ESM__: false,
  }),
];

const loader = (cli = false) =>
  webpackLoader(
    {
      typescript: true,
      nodeExternals: true,
      tsloader: {
        transpileOnly: true,
      },
      cli,
      stats(stats) {
        if (stats.compilation.errors.length !== 0) {
          console.log(stats.compilation.errors);
        }
      },
    },
    {
      mode: 'production',
      plugins: webpackPlugins,

      resolve: {
        plugins: [new TsconfigPathsPlugin.TsconfigPathsPlugin({})],
      },
    }
  );

asto([
  {
    // core packages
    loader: loader(),

    entryPoints: [
      // zely
      repos.zely('index.ts', 'index.js'),
      repos.zely('server.ts', 'server.js'),
      repos.zely('export-config.ts', 'config.js'),
      repos.zely('export-methods.ts', 'methods.js'),

      // vite plugin zely
      repos.vitePlugin('index.ts', 'index.js'),
    ],
  },
  {
    // cli
    loader: loader(true),
    entryPoints: [repos.zely('bin/index.ts', 'bin.js')],
  },
]);
