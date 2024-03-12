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
          minify: false,

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
          minify: false,
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
  zely: repo('zely-js'),
  core: repo('zely-js-core'),
  loader: repo('zely-js-loader'),
  loaderesbuild: repo('zely-js-loader-esbuild'),
  logger: repo('zely-js-logger'),
  cli: repo('zely-js-cli'),
  watch: repo('zely-js-watch'),
  reporter: repo('zely-js-reporter'),
};

const entryPoints = [
  // zely
  ...repos.zely('index.ts', 'index.js', true),
  ...repos.core('index.ts', 'index.js', true),
  ...repos.loader('index.ts', 'index.js', true),
  ...repos.loaderesbuild('index.ts', 'index.js', true),
  ...repos.logger('index.ts', 'index.js', true),
  ...repos.cli('index.ts', 'index.js', true),
  ...repos.watch('index.ts', 'index.js', true),
  ...repos.reporter('index.ts', 'index.js', true),
];

module.exports = [
  {
    // core packages
    loader: esbuild,

    entryPoints,
  },
];
