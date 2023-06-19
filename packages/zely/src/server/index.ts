import { rmSync } from 'fs';
import { OsikServer, osik } from 'osik';
import { Config } from '../config';
import { CACHE_DIRECTORY } from '../constants';
import { Handler, getPages } from '../core';
import { loadMiddlewares } from './load-middlewares';
import { applyPlugins } from '../apply-plugins';

export async function Zely(config: Config): Promise<OsikServer> {
  rmSync(CACHE_DIRECTORY, { recursive: true, force: true });

  const app = osik(config.server?.osik);

  // plugins

  config.middlewares?.forEach((middleware) => {
    app.use(middleware);
  });

  applyPlugins(app, config);

  // auto middleware mode

  if (config.allowAutoMiddlewares) {
    const middlewares = await loadMiddlewares(config);

    middlewares.forEach((middleware) => {
      app.use(middleware.default || middleware);
    });
  }

  if (config.prebuild) {
    await getPages(config);
  }

  // handle

  app.use((req, res) => {
    Handler(req as any, res as any, config);
  });

  return app;
}
