import { App, senta } from 'senta';
import { error, warn } from '@zely-js/logger';
import { pathToRegexp } from '@zept/path-regexp';
import { performance } from 'node:perf_hooks';
import { version } from 'serpack/package.json';
import { join, parse, relative } from 'node:path';

import { existsSync, readFileSync, rmSync } from '$fs';

import { readDirectory } from '~/zely-js-core/lib/read-directory';
import type { Context, UserConfig } from '~/zely-js-core';
import { createMiddlewares } from './middlewares';
import { Page, PageCache, controll } from './controller';
import { transformFilename } from '~/zely-js-core/lib/file-to-path';
import { removeExtension } from '~/zely-js-core/lib/ext';

import { kitMiddleware } from './middlewares/support';
import { createVirtualPage } from './virtual';
import { GET } from '../runtime/methods';

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

export function getFile(files: string[], options: UserConfig) {
  return filenameToRoute(
    files.map((file) => {
      const relativePath = relative(join(options.cwd || process.cwd(), 'pages'), file);
      const path = transformFilename(removeExtension(relativePath), true);

      return {
        filename: relativePath.replace(/\\/g, '/'),
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
  )
    .map((file) => {
      const outregex = pathToRegexp(file.path);

      return {
        ...file,
        regex: outregex.pattern,
        params: outregex.params,
      };
    })
    .concat(options.__virtuals__ || []);
}

export async function createZelyServer(options: UserConfig) {
  // exit early if no options provided
  if (!options) {
    error(new Error('config must be provided'));
    process.exit(1);
  }

  if (!process.env.ZELY_WORKING_FRAMEWORK) {
    // warn('Running app with @zely-js/zely is recommended.');

    if ((options as any).plugins) {
      warn(
        '"options.plugins" is not an available option in @zely-js/core. Please use @zely-js/zely to use plugins.'
      );
    }
  }

  if (options.experimental?.useSerpack) {
    warn(
      `Serpack is not ready to be used for production yet. \nSee documentation - https://zely.vercel.app/serpack/introduction (experimental-${version})`
        .gray
    );
  }

  if (existsSync(join(options.cwd || process.cwd(), '.zely'))) {
    rmSync(join(options.cwd || process.cwd(), '.zely'), { recursive: true, force: true });
  }

  await import('../runtime/env');
  if (!options.__virtuals__) {
    options.__virtuals__ = [];
  }

  // frontend support
  options.__virtuals__.push(
    createVirtualPage('/__fe/[...params].ts', [
      GET((ctx: Context) => {
        const path = ctx.params['*'];

        if (path.endsWith('.js')) {
          ctx.headers({
            'Content-Type': 'text/javascript',
          });

          const target = join(
            options.cwd || process.cwd(),
            options.dist || '.zely',
            'fe',
            path
          );

          if (!existsSync(target)) {
            ctx.status(404);
            return { code: 404, message: 'File not found' };
          }

          const content = readFileSync(target).toString();
          ctx.send(content);
        }
      }),
    ])
  );

  options.__virtuals__ = filenameToRoute(options.__virtuals__)
    .map((file) => {
      const outregex = pathToRegexp(file.path);

      return {
        ...file,
        regex: outregex.pattern,
        params: outregex.params,
      };
    })
    .concat(options.__virtuals__ || []);

  if (!options.loaders) options.loaders = [];

  const middlewares = (await createMiddlewares(options)).map(
    (middleware) => async (ctx, next) => {
      await middleware(ctx, next);
    }
  );

  const server = senta(options.server?.options || {});

  const files = existsSync(join(options.cwd || process.cwd(), 'pages'))
    ? readDirectory(join(options.cwd || process.cwd(), 'pages'))
    : [];
  const pages = new PageCache(getFile(files, options), options);

  if (process.env.NODE_ENV === 'production') {
    await pages.productionBuild();
  }

  const applyZelyMiddlewares = async (serverInstance: App) => {
    // Request/Response => ZelyRequest/Response
    serverInstance.use(kitMiddleware);

    // user middlewares
    serverInstance.use(middlewares);

    // core handler
    serverInstance.use(async (ctx, next) => {
      await controll(ctx as Context, next, options, pages);
    });
  };

  return { server, applyZelyMiddlewares, cache: pages };
}
