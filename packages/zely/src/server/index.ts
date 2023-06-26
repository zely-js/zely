import { rmSync } from 'fs';
import { OsikServer, osik } from 'osik';
import { Config } from '../config';
import { CACHE_DIRECTORY } from '../constants';
import { Handler, getPages } from '../core';
import { loadMiddlewares } from './load-middlewares';
import { applyPlugins } from '../apply-plugins';
import { info } from '../logger';

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
    info('config.prebuild enabled.');
    await getPages(config);
    console.log();
  }

  await Promise.all(
    // eslint-disable-next-line array-callback-return
    config.plugins?.map(async (plugin) => {
      if (plugin.config) await plugin.config(config || {});
    })
  );

  // handle

  app.use((req, res) => {
    Handler(req as any, res as any, config);
  });

  return app;
}
