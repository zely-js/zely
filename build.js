const { join } = require('path');
const { compile } = require('serpack');

const base = join(process.cwd(), './packages', 'zely-js-core', 'src');

compile(
  {
    [join(base, './index.ts')]: 'index',
  },
  {
    outdir: join(base, '../dist'),
    format: ['cjs', 'esm'],
    chunks: {
      name: '[index]',
    },
    clean: true,
    buildOptions: {
      minify: true,
    },
    resolverOptions: {
      conditionNames: ['node', 'import'],
      mainFields: ['module', 'main'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.d.ts'],
      tsconfig: {
        configFile: join(process.cwd(), 'tsconfig.json'),
      },
    },
  }
);
