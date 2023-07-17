// middlewares

import { join } from 'path';
import { Config } from '../config';
import { readDirectory } from '../../lib/readDirectory';
import { typescriptLoader } from '../loader';

export async function loadMiddlewares(config: Config) {
  if (config.middlewareDirectory) {
    const base = config.middlewareDirectory;
    const files = readDirectory(base);

    const modules = [];

    for await (const file of files) {
      const m = await typescriptLoader(join(file), config, 'middlewares');

      modules.push(m.m);
    }

    return modules;
  }

  return [];
}

export async function loadMiddlewaresModluePath(config: Config) {
  if (config.middlewareDirectory) {
    const base = config.middlewareDirectory;
    const files = readDirectory(base);

    const modules = [];

    for await (const file of files) {
      const m = await typescriptLoader(join(file), config, 'middlewares');

      modules.push(m.filename);
    }

    return modules;
  }

  return [];
}
