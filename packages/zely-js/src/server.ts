import { warn } from '@zely-js/logger';
import { createZelyServer } from '@zely-js/core';
import { applyServer, applyConfig } from './plugin';
import { Config } from '../types/config';

export async function zely(options: Config) {
  options = await applyConfig(options);

  const zely = await createZelyServer({
    ...options,
  });
  const { server, applyZelyMiddlewares } = zely;

  if (!process.env.ZELY_WORKING_FRAMEWORK) {
    process.env.ZELY_WORKING_FRAMEWORK = '@zely-js/zely';
  }

  server.use((ctx, next) => {
    // TODO

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (ctx.response as any).snatch = (..._params: any) => {
      warn('snatcher has been deprecated');
    };

    next();
  });

  // apply plugins

  options = await applyServer(server, options);

  // additional features
  // snatcher, prewrite, etc...

  await applyZelyMiddlewares(server);

  return server;
}
