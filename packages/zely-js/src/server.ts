import { warn } from '@zely-js/logger';
import { createZelyServer } from '@zely-js/core';
import { applyPlugin } from './plugin';
import { Config } from '../types/config';

export async function zely(options: Config) {
  const server = await createZelyServer(options);

  if (!process.env.ZELY_WORKING_FRAMEWORK) {
    process.env.ZELY_WORKING_FRAMEWORK = '@zely-js/zely';
  }

  // apply plugins

  options = await applyPlugin(server, options);

  // additional features
  // snatcher, prewrite, etc...
  server.useProcessor((req, _res, next) => {
    // TODO

    // eslint-disable-next-line no-unused-vars
    (req as any).snatch = (..._params) => {
      warn('snatcher will be implemented in the future');
    };

    next();
  });

  return server;
}
