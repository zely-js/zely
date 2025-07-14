/* eslint-disable import/no-import-module-exports */

import { isAbsolute, join, relative } from 'node:path';
import { debug } from '@zely-js/logger';
import { access } from 'node:fs/promises';
import { writeFileSync as nativeWrite } from 'node:fs';
import { Runtime } from 'serpack/runtime';

import { mkdirSync, readFileSync, writeFileSync } from '$fs';

import type { Context, UserConfig } from '~/zely-js-core';
import type { TransformOptions, LoaderFunc } from '~/zely-js-core/types/loader';

import { esbuildLoader } from './esbuild';
import { serpackLoader } from './serpack';
import { HTMLloader } from '../../fe/html/plugin';

function requireFromString(code: string, filename: string, options?: any) {
  const m = new (module.constructor as any)(filename, options?.parent);
  m.filename = filename;
  m.paths = (module.constructor as any)._nodeModulePaths(filename);
  m._compile(code, filename);
  return m.exports;
}

async function loadFile(id: string) {
  // const relativePath = relative(__dirname, id).replace(/\\/g, '/');
  try {
    // if (__ESM__) {
    //   return await import(relativePath);
    // }
    // return require(relativePath);

    const code = readFileSync(id, 'utf-8');
    const mod = requireFromString(code, id);
    return mod;
  } catch (e) {
    console.error(e);
    throw new Error(`Error occurred while importing ${id}`);
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

    runtime.__modules__ = {
      ...runtime.__modules__,
    };

    const m = runtime.loadModule('sp:0');

    return m;
  }

  return mod;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function createLoader<T>(
  options: UserConfig,
  ctx?: Context,
  serpack?: boolean,
  noRun: boolean = false,
  useMemoryFS: boolean = true
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

  return async (id, buildOptions) => {
    const now = performance.now();

    if (!isAbsolute(id)) {
      id = join(process.cwd(), id);
    }

    const distPath = join(options.cwd || process.cwd(), options.dist || '.zely');

    if (!(await exists(distPath))) mkdirSync(distPath);
    if (!(await exists(join(distPath, 'package.json')))) {
      if (useMemoryFS) {
        writeFileSync(join(distPath, 'package.json'), '{"type": "commonjs"}');
      } else {
        nativeWrite(join(distPath, 'package.json'), '{"type": "commonjs"}');
      }
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
