/* eslint-disable no-unused-vars */

import { relative } from 'node:path';
import { readFileSync } from 'node:fs';

import type { UserConfig } from '~/zely-js-core';
import type { TransformOptions, LoaderFunc } from '~/zely-js-core/types/loader';

import { esbuildLoader } from './esbuild';

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
  options: UserConfig
): (id: string, options?: TransformOptions<T>) => Promise<LoaderFunc> {
  if (!options.loaders) {
    options.loaders = [];
  }

  options.loaders.push(esbuildLoader(options));

  return async (id, buildOptions) => {
    for await (const loader of options.loaders) {
      const output = await loader?.transform(
        id,
        readFileSync(id).toString(),
        buildOptions || { type: 'cache', buildOptions: {} }
      );

      if (output) {
        return {
          module: await load(output.filename),
          filename: output.filename,
          map: output.map,
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
