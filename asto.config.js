const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { parse, join } = require('path');
const { esbuildLoader } = require('asto');

const esbuild = esbuildLoader();

const repo =
  (name) =>
  (input, output, esm = false, base = 'packages') => {
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
              packagePath: `${base}/${name}/package.json`,
            }),
          ],
        },
      },
    ];

    if (esm) {
      const parsed = parse(`${base}/${name}/dist/${output}`);

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
  logger: repo('zely-js-logger'),
  cli: repo('zely-js-cli'),
  dev: repo('zely-js-dev'),
  optimizer: repo('zely-js-optimizer'),
};

const entryPoints = [
  // zely
  ...repos.zely('index.ts', 'index.js', true),
  ...repos.zely('../middlewares/index.ts', 'middlewares.js', true),
  ...repos.core('index.ts', 'index.js', true),
  ...repos.logger('index.ts', 'index.js', true),
  ...repos.cli('index.ts', 'index.js', true),
  ...repos.dev('index.ts', 'index.js', true),
  ...repos.optimizer('index.ts', 'index.js', true),
];

module.exports = [
  {
    // core packages
    loader: esbuild,

    entryPoints,
  },
];
