/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

import { build } from 'esbuild';

import { load } from '$zely/require';

import { CACHE_DIRECTORY, DEFAULT_CONFIG } from './constants';
import { typescriptLoader } from './loader';

import type {
  Config,
  Plugin,
  FileData,
  pureMiddleware,
  StaticOptions,
} from '../types/index.d';

export { Config, Plugin, FileData, pureMiddleware, StaticOptions };

export function assign(c: Config): Config {
  return {
    ...DEFAULT_CONFIG,
    ...c,
  };
}

export async function getConfig(target?: string): Promise<Config> {
  if (target) {
    return assign(await load(relative(__dirname, target)));
  }

  if (existsSync('zely.config.js')) {
    return assign(await load(relative(__dirname, join(process.cwd(), 'zely.config.js'))));
  }

  if (existsSync('zely.config.ts')) {
    return assign(
      await (
        await typescriptLoader(
          join(process.cwd(), 'zely.config.ts'),
          DEFAULT_CONFIG,
          'core'
        )
      ).m.default
    );
  }

  return DEFAULT_CONFIG;
}

export async function configDev(
  base: string = CACHE_DIRECTORY,
  format: string = 'cjs'
): Promise<string> {
  if (existsSync('zely.config.js')) {
    await build({
      entryPoints: ['zely.config.js'],
      outfile: join(base, 'core.config.js'),
      bundle: true,
      minify: true,
    });

    return join(base, 'core.config.js');
  }

  if (existsSync('zely.config.ts')) {
    const built = await typescriptLoader(
      join(process.cwd(), 'zely.config.ts'),
      undefined,
      'cache',
      base,
      format as 'cjs' | 'esm',
      false
    );

    return built.filename;
  }

  return null;
}
