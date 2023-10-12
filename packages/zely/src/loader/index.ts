import { join, parse, relative } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

import loadModule from '$zely/lib/webpack';
import randomFilename from '$zely/lib/random-filename';

import { CACHE_DIRECTORY } from '../constants';
import { Config } from '../config';
import { error } from '../logger';
import { filenamePlugin } from './plugins/filename';

const tracer = join(CACHE_DIRECTORY, 'tracer');

export function typescriptLoader(
  target: string,
  config: Config = {},
  type: 'cache' | 'core' | 'pages' | 'middlewares' = 'cache'
): Promise<{ filename: string; m: any }> {
  if (!existsSync(CACHE_DIRECTORY)) {
    mkdirSync(CACHE_DIRECTORY);
  }
  if (!existsSync(join(CACHE_DIRECTORY, 'pages'))) {
    mkdirSync(join(CACHE_DIRECTORY, 'pages'));
  }
  if (!existsSync(join(CACHE_DIRECTORY, 'cache'))) {
    mkdirSync(join(CACHE_DIRECTORY, 'cache'));
  }
  if (!existsSync(join(CACHE_DIRECTORY, 'middlewares'))) {
    mkdirSync(join(CACHE_DIRECTORY, 'middlewares'));
  }
  if (!existsSync(join(CACHE_DIRECTORY, 'core'))) {
    mkdirSync(join(CACHE_DIRECTORY, 'core'));
  }

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
      write: false,

      sourcemap: 'external',

      plugins: [nodeExternalsPlugin() as any, filenamePlugin],
      ...(config.esbuild || {}),
    })
      .then((out) => {
        for (const output of out.outputFiles) {
          if (output.path.endsWith('.map')) {
            // sourcemap
            if (!existsSync(tracer)) {
              writeFileSync(tracer, '{}');
            }
            const sourcemaps = JSON.parse(readFileSync(tracer).toString());

            sourcemaps[output.path.replace(/\\/g, '/')] = output.text;
            writeFileSync(tracer, JSON.stringify(sourcemaps));
          } else {
            writeFileSync(output.path, output.text);
          }
        }

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
