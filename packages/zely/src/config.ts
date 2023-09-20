/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

import { build } from 'esbuild';

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
    return assign(require(relative(__dirname, target)));
  }

  if (existsSync('zely.config.js')) {
    return assign(require(relative(__dirname, join(process.cwd(), 'zely.config.js'))));
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

export async function configDev(): Promise<string> {
  if (existsSync('zely.config.js')) {
    await build({
      entryPoints: ['zely.config.js'],
      outfile: join(CACHE_DIRECTORY, 'core.config.js'),
      bundle: true,
      minify: true,
    });

    return join(CACHE_DIRECTORY, 'core.config.js');
  }

  if (existsSync('zely.config.ts')) {
    const built = await typescriptLoader(join(process.cwd(), 'zely.config.ts'));

    return built.filename;
  }

  return null;
}
