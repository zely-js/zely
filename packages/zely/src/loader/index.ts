import { join, parse, relative } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

import randomFilename from '$zely/lib/random-filename';
import { load as loader } from '$zely/require';

import { CACHE_DIRECTORY } from '../constants';
import { Config } from '../config';
import { error } from '../logger';
import { filenamePlugin } from './plugins/filename';

const tracer = join(CACHE_DIRECTORY, 'tracer');

export function typescriptLoader(
  target: string,
  config: Config = {},
  type: 'cache' | 'core' | 'pages' | 'middlewares' = 'cache',
  base: string = CACHE_DIRECTORY,
  format: 'cjs' | 'esm' = __ESM__ ? 'esm' : 'cjs',
  load: boolean = true
): Promise<{ filename: string; m: any }> {
  if (target.endsWith('.js')) {
    // js

    return new Promise((resolve) => {
      loader(relative(__dirname, target).replace(/\\/g, '/')).then((m) => {
        resolve({
          filename: target,
          m,
        });
      });
    });
  }

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

  if (!existsSync(join(CACHE_DIRECTORY, 'package.json'))) {
    if (__ESM__) {
      writeFileSync(join(CACHE_DIRECTORY, 'package.json'), '{"type":"module"}');
    } else {
      writeFileSync(join(CACHE_DIRECTORY, 'package.json'), '{"type":"commonjs"}');
    }
  }

  const dist = join(join(base, type), parse(randomFilename(target)).base);
  return new Promise((resolve) => {
    build({
      entryPoints: [target],
      // node_modules/.zely/~
      outfile: dist,

      bundle: true,
      minify: true,

      platform: 'node',
      format,
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

        if (load) {
          loader(relative(__dirname, dist).replace(/\\/g, '/')).then((m) => {
            resolve({
              filename: dist,
              m,
            });
          });
        } else {
          // @ts-expect-error
          resolve({
            filename: dist,
          });
        }
      })
      .catch((e) => {
        error(e);
      });
  });
}
