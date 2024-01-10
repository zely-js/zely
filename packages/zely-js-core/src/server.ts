import { ZeptServer } from '@zept/http';
import { error } from '@zely-js/logger';
import { pathToRegexp } from '@zept/path-regexp';

import { performance } from 'node:perf_hooks';
import { join, parse, relative } from 'node:path';

import { readDirectory } from '~/zely-js-core/lib/read-directory';
import type { UserConfig } from '~/zely-js-core';

import { createMiddlewares } from './middlewares';
import { Context } from './context';
import { Page, PageCache, controll } from './controller';
import { transformFilename } from '~/zely-js-core/lib/file-to-path';
import { removeExtension } from '~/zely-js-core/lib/ext';
import { kitMiddleware } from './middlewares/support';

export function prettyURL(path: string): string {
  if (path === '.') {
    path = '';
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path;
}

/**
 * sort pages and transform filename to path
 * @param map
 * @param useBrackets
 * @returns
 */
export function filenameToRoute(map: Array<Page>, useBrackets: boolean = false): Page[] {
  const rawfiles = map.map((page) => {
    if (page) {
      // transform filename to path

      let { path } = page;
      // eslint-disable-next-line prefer-const
      let { dir, name } = parse(path);

      if (name === 'index') {
        name = '';
      }

      path = join(dir, name);
      path = path.replace(/\\/g, '/');
      path = transformFilename(path, useBrackets);
      path = prettyURL(path);

      return {
        ...page,
        path,
      };
    }
    return null;
  });

  // sort
  const files = {};

  rawfiles.forEach((file) => {
    if (file) {
      const count = (file.path.match(/:/g) || []).length;

      if (!files[count]) files[count] = [];

      files[count].push(file);
    }
  });

  const filesResult: Page[] = [];

  Object.keys(files).forEach((file) => {
    filesResult.push(...files[file]);
  });

  return filesResult;
}

export async function createZely(options: UserConfig) {
  // exit early if no options provided
  if (!options) {
    error(new Error('config must be provided'));
    process.exit(1);
  }

  const middlewares = (await createMiddlewares(options)).map(
    (middleware) => async (req, res, next) => {
      await middleware(new Context(req, res), next);
    }
  );

  const server = new ZeptServer(options.server?.options || {});

  const files = readDirectory(join(options.cwd || process.cwd(), 'pages'));
  const pages = new PageCache(
    filenameToRoute(
      files.map((file) => {
        const relativePath = relative(join(options.cwd || process.cwd(), 'pages'), file);
        const path = transformFilename(removeExtension(relativePath), true);

        return {
          filename: relativePath,
          regex: null,
          params: null,
          path,
          id: performance.now(),
          module: {
            type: 'unknown',
            isLoaded: false,
          },
        };
      })
    ).map((file) => {
      const outregex = pathToRegexp(file.path);

      return {
        ...file,
        regex: outregex.pattern,
        params: outregex.params,
      };
    }),
    options
  );

  // Request/Response => ZelyRequest/Response
  server.use(kitMiddleware);

  // user middlewares
  server.use(...middlewares);

  // core handler
  server.use(async (req, res, next) => {
    // @ts-expect-error
    await controll(req, res, next, options, pages);
  });

  return server;
}