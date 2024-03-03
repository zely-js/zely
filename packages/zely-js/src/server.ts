import { ZeptServer } from '@zept/http';
import { warn } from '@zely-js/logger';
import { createZelyServer } from '@zely-js/core';
import { applyServer, applyConfig } from './plugin';
import { Config } from '../types/config';

export async function zely(options: Config) {
  const zept = new ZeptServer(options.server?.options);

  if (!options.server) options.server = {};

  options.server.zept = zept;

  options = await applyConfig(options);

  const zely = await createZelyServer({
    ...options,
  });
  const { server, applyZelyMiddlewares } = zely;

  if (!process.env.ZELY_WORKING_FRAMEWORK) {
    process.env.ZELY_WORKING_FRAMEWORK = '@zely-js/zely';
  }

  // apply plugins

  options = await applyServer(server, options);

  // additional features
  // snatcher, prewrite, etc...
  server.useProcessor((req, _res, next) => {
    // TODO

    // eslint-disable-next-line no-unused-vars
    (req as any).snatch = (..._params) => {
      warn('snatcher has been deprecated until 3.0');
    };

    next();
  });

  await applyZelyMiddlewares(server);

  return server;
}
