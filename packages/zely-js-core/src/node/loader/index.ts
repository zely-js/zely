/* eslint-disable no-unused-vars */

import { isAbsolute, join, relative } from 'node:path';
import { debug } from '@zely-js/logger';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Runtime } from 'serpack/runtime';

import type { Context, UserConfig } from '~/zely-js-core';
import type { TransformOptions, LoaderFunc } from '~/zely-js-core/types/loader';

import { esbuildLoader } from './esbuild';
import { serpackLoader } from './serpack';
import { HTMLloader } from '../../fe/html/plugin';

async function loadFile(id: string) {
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

async function load(id: string, serpack: boolean = false) {
  const modRaw = await loadFile(id);
  const mod = modRaw.default ?? modRaw;

  if (
    serpack &&
    process.env.NODE_ENV !== 'production' &&
    mod.__serpack_module__ !== undefined
  ) {
    const runtime = new Runtime(mod);

    const m = runtime.loadModule('sp:0');

    return m;
  }

  return mod;
}

export function createLoader<T>(
  options: UserConfig,
  ctx?: Context,
  serpack?: boolean,
  noRun: boolean = false
): (id: string, options?: TransformOptions<T>) => Promise<LoaderFunc> {
  if (!options.loaders) {
    options.loaders = [];
  }

  const enableSerpack = serpack || options?.experimental?.useSerpack;

  if (enableSerpack) {
    // serpack loader
    options.loaders.push(serpackLoader(options));
  } else {
    // esbuild loader
    options.loaders.push(esbuildLoader(options));
  }

  // html loader
  if (options.experimental?.useHTML) {
    options.loaders.push(HTMLloader(options));
  }

  const distPath = join(options.cwd || process.cwd(), options.dist || '.zely');

  if (!existsSync(distPath)) mkdirSync(distPath);

  writeFileSync(join(distPath, 'package.json'), '{"type": "commonjs"}');

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
          module: !noRun ? await load(output.filename, enableSerpack) : undefined,
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
