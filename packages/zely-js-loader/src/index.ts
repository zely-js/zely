/* eslint-disable no-unused-vars */
import { esbuildLoader } from '@zely-js/loader-esbuild';

import { relative } from 'node:path';
import { readFileSync } from 'node:fs';

import type { UserConfig } from '~/zely-js-core';
import type { TransformOptions, TransformOutput } from '~/zely-js-loader';

async function load(id: string) {
  const relativePath = relative(__dirname, id).replace(/\\/g, '/');
  try {
    if (__ESM__) {
      return await import(relativePath);
    }
    return require(relativePath);
  } catch (e) {
    throw new Error(`Error occurred while importing ${relativePath}`);
  }
}

export function createLoader<T>(
  options: UserConfig
): (id: string, options?: TransformOptions<T>) => Promise<TransformOutput> {
  if (!options.loader) {
    options.loader = esbuildLoader(options);
  }

  return async (id, buildOptions) => {
    const output = await options.loader?.transform(
      id,
      readFileSync(id).toString(),
      buildOptions || { type: 'cache', buildOptions: {} }
    );

    return {
      module: await load(output.filename),
      filename: output.filename,
      map: output.map,
    };
  };
}
