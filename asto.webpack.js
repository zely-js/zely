const { webpackLoader } = require('@asto/webpack');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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

module.exports = { webpackPlugins, loader };
