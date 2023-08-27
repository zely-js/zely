import { join, parse, relative } from 'node:path';

import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

import loadModule from '$zely/lib/webpack';
import randomFilename from '$zely/lib/random-filename';

import { CACHE_DIRECTORY } from '../constants';
import { Config } from '../config';
import { error } from '../logger';
import { filenamePlugin } from './plugins/filename';

export function typescriptLoader(
  target: string,
  config: Config = {},
  type: 'cache' | 'core' | 'pages' | 'middlewares' = 'cache'
): Promise<{ filename: string; m: any }> {
  const dist = join(join(CACHE_DIRECTORY, type), parse(randomFilename(target)).base);
  return new Promise((resolve) => {
    build({
      entryPoints: [target],
      // node_modules/.zely/~
      outfile: dist,

      bundle: true,
      minify: true,

      platform: 'node',
      format: 'cjs',

      sourcemap: true,

      plugins: [nodeExternalsPlugin() as any, filenamePlugin],
      ...(config.esbuild || {}),
    })
      .then(() => {
        resolve({
          filename: dist,
          m: loadModule(relative(__dirname, dist).replace(/\\/g, '/')),
        });
      })
      .catch((e) => {
        error(e);
      });
  });
}
