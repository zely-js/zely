/* eslint-disable no-unused-vars */

import { isAbsolute, join, relative } from 'node:path';
import { debug } from '@zely-js/logger';
import { readFileSync } from 'node:fs';

import type { Context, UserConfig } from '~/zely-js-core';
import type { TransformOptions, LoaderFunc } from '~/zely-js-core/types/loader';

import { esbuildLoader } from './esbuild';
import { serpackLoader } from './serpack';

async function load(id: string) {
  const relativePath = relative(__dirname, id).replace(/\\/g, '/');
  try {
    if (__ESM__) {
      return await import(relativePath);
    }
    return require(relativePath);
  } catch (e) {
    console.error(e);
    throw new Error(`Error occurred while importing ${relativePath}`);
  }
}

export function createLoader<T>(
  options: UserConfig,
  ctx?: Context,
  serpack?: boolean
): (id: string, options?: TransformOptions<T>) => Promise<LoaderFunc> {
  if (!options.loaders) {
    options.loaders = [];
  }

  if (serpack || options?.experimental?.useSerpack) {
    options.loaders.push(serpackLoader(options));
  } else {
    options.loaders.push(esbuildLoader(options));
  }

  return async (id, buildOptions) => {
    const now = performance.now();

    if (!isAbsolute(id)) {
      id = join(process.cwd(), id);
    }

    for await (const loader of options.loaders) {
      const output = await loader?.transform(
        id,
        readFileSync(id).toString(),
        buildOptions || { type: 'cache', buildOptions: {} },
        ctx
      );

      if (output) {
        if (process.argv.includes('--loader-performance')) {
          debug(
            `[${loader.name}] compiled ${relative(process.cwd(), id)} in ${(
              performance.now() - now
            ).toFixed(2)}ms`
          );
        }
        return {
          module: await load(output.filename),
          filename: output.filename,
          map: output.map,
          assets: output.assets,
        };
      }
    }

    throw new Error(
      `Cannot compile ${id}. (loaders : ${options.loaders
        .map((loader) => loader.name || 'unknown-loader')
        .join(', ')})`
    );
  };
}

export { esbuildLoader };
