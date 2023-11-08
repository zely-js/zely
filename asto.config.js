const { nodeExternalsPlugin } = require('esbuild-node-externals');
const esbuild = require('./asto.esbuild');
const { loader } = require('./asto.webpack');

const repo =
  (name) =>
  (input, output, esm = false) => {
    const out = [
      {
        input: `packages/${name}/src/${input}`,
        output: `packages/${name}/dist/cjs/${output}`,
        /**
         * @type {import("esbuild").BuildOptions}
         */
        options: {
          banner: {
            js: '/*/dist/cjs/=>/dist/*/__dirname=require("path").join(__dirname, "../");',
          },
          logLevel: 'error',
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
      },
    ];

    if (esm) {
      out.push({
        input: `packages/${name}/src/${input}`,
        output: `packages/${name}/dist/${output}`,
        /**
         * @type {import("esbuild").BuildOptions}
         */
        options: {
          banner: {
            js: "import * as url from 'url'; const __filename = url.fileURLToPath(import.meta.url);const __dirname = url.fileURLToPath(new URL('.', import.meta.url));",
          },
          format: 'esm',
          logLevel: 'error',
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
          entryPoints: [...repos.zely('bin/index.ts', 'bin.js')],
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
          entryPoints: [...repos.zely('bin/index.ts', 'bin.js')],
        },
      ];
