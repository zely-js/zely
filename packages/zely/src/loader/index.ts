import { build } from 'esbuild';
import { join, parse, relative } from 'path';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import randomFilename from '../../lib/random-filename';
import { CACHE_DIRECTORY } from '../constants';
import { Config } from '../config';
import { error } from '../logger';
import pkg from '../../package.json';
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
      format: __ESM__ ? 'esm' : 'cjs',
      plugins: [nodeExternalsPlugin() as any, filenamePlugin],
      banner: {
        js: `/*** ${target}=>${dist} ***/\n/***  version: ${pkg.version}  ***/\n`,
      },
      ...(config.esbuild || {}),
    })
      .then(() => {
        // console.log(relative(__dirname, dist));
        resolve({ filename: dist, m: require(relative(__dirname, dist)) });
      })
      .catch((e) => {
        error(e);
      });
  });
}
