import { join } from 'node:path';

import { createLoader } from '../node/loader';

import type { Middleware, UserConfig } from '~/zely-js-core';
import { readDirectory } from '~/zely-js-core/lib/read-directory';

/**
 * append auto middlewares
 * @param options user config
 */
async function appendMiddlewareFiles(options: UserConfig) {
  const middlewares: Middleware[] = [];
  const base = join(
    options.cwd || process.cwd(),
    options.middlewareDirectory || 'middlewares'
  );
  const files = readDirectory(base);

  const loader = createLoader(options);

  for await (const file of files) {
    const middleware = await loader(file, {
      type: 'middleware',
      buildOptions: {},
    });

    middlewares.push(middleware.module as any);
  }

  return middlewares;
}

/**
 * @returns middlewares
 */
export async function createMiddlewares(options: UserConfig) {
  const middlewares: Middleware[] = options.middlewares || [];

  if (options.allowAutoMiddlewares) {
    middlewares.push(
      ...(await appendMiddlewareFiles(options)).map((a: any) => a?.default || a)
    );
  }

  return middlewares;
}
