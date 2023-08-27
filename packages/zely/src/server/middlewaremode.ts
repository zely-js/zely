import { rmSync } from 'node:fs';

import { Config, pureMiddleware } from '../config';
import { Handler, getPages } from '../core';
import { error, warn } from '../logger';
import { kitMiddleware } from '../plugins/kit';
import { loadMiddlewares } from './load-middlewares';
import { CACHE_DIRECTORY } from '../constants';
import { Static } from '../plugins/public';

export async function middleware(config: Config): Promise<pureMiddleware[]> {
  if (!config.plugins) config.plugins = [];

  // plugin.config
  await Promise.all(
    // eslint-disable-next-line array-callback-return
    config.plugins?.map(async (plugin) => {
      if (plugin.config) {
        const output = await plugin.config(config || {});

        if (output) {
          config = {
            ...config,
            ...output,
          };
        }
      }
    })
  );

  // plugin.setup
  await Promise.all(
    // eslint-disable-next-line array-callback-return
    config.plugins?.map(async (plugin) => {
      if (plugin.setup) {
        await plugin.setup();
      }
    })
  );

  if (!config.server?.middlewareMode) {
    error(
      'This function is not available when config.server.middlewareMode is disabled.'
    );
    return;
  }
  if (!config.server?.keepCache) {
    rmSync(CACHE_DIRECTORY, { recursive: true, force: true });
  }

  const middlewares: pureMiddleware[] = [];

  config.middlewares?.forEach((middleware) => {
    middlewares.push(middleware);
  });

  config.plugins?.forEach((plugin) => {
    // console.log(plugin);
    if (plugin.server) {
      warn(
        `[${plugin.name}] plugin.server was ignored (reason: config.server.middlewareMode enabled)`
      );
    }
  });

  // @zely/plugin-kit

  middlewares.push(kitMiddleware);

  // @osik/static

  if (config.public) middlewares.push(Static(config.public, config.publicOptions));

  // auto middleware mode

  if (config.allowAutoMiddlewares) {
    const middlewares = await loadMiddlewares(config);

    middlewares.forEach((middleware) => {
      middlewares.push(middleware.default || middleware);
    });
  }

  if (config.error) {
    warn('config.error is not available when config.server.middlewareMode is enabled.');
  }

  // generate cache files

  getPages(config);

  // handle

  middlewares.push((req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    config.error = (req, res) => {
      next();
    };
    Handler(req as any, res as any, config);
  });

  if (config.prebuild) {
    warn('config.prebuild is ignored (reason: config.server.middlewareMode enabled)');
  }

  return middlewares;
}
