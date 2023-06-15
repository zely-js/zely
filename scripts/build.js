const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { join } = require('path');

/** @type {import("esbuild").BuildOptions } */
const base = {
  target: 'esnext',
  bundle: true,
  platform: 'node',
};

const build = (
  pkg,
  entryPoint = 'src/index.ts',
  out = { cjs: 'dist/index.js', esm: 'dist/index.esm.js' },
  cfg = {}
) => {
  console.log(join(process.cwd(), 'packages', pkg, 'package.json'));
  /** @type {import("esbuild").BuildOptions } */
  const pkgBase = {
    entryPoints: [join(process.cwd(), 'packages', pkg, entryPoint)],
    plugins: [
      // @ts-ignore
      nodeExternalsPlugin({
        packagePath: join(process.cwd(), 'packages', pkg, 'package.json'),
        devDependencies: false,
      }),
    ],
    external: ['esbuild'],
  };
  if (out.cjs) {
    // @ts-ignore
    esbuild.build({
      outfile: join(process.cwd(), 'packages', pkg, out.cjs),
      ...pkgBase,
      ...base,
      ...cfg,
      format: 'cjs',
      define: {
        __ESM__: 'false',
      },
    });
  }

  if (out.esm) {
    // @ts-ignore
    esbuild.build({
      outfile: join(process.cwd(), 'packages', pkg, out.esm),
      ...pkgBase,
      ...base,
      ...cfg,
      format: 'esm',
      define: {
        __ESM__: 'true',
      },
    });
  }
};

build('zely');
// cli
build('zely', 'src/bin/index.ts', { cjs: 'dist/bin.js', esm: 'dist/bin.esm.js' });
build('zely', 'src/server.ts', { cjs: 'dist/server.js', esm: 'dist/server.esm.js' });
build('zely', 'src/export-config.ts', {
  cjs: 'dist/config.js',
  esm: 'dist/config.esm.js',
});
