import { createZelyServer } from '@zely-js/core';
import { applyPlugin } from './plugin';
import { Config } from '../types/config';

export async function zely(options: Config) {
  const server = await createZelyServer(options);

  // apply plugins

  options = await applyPlugin(server, options);

  // additional features
  // snatcher, prewrite, etc...
  server.useProcessor((req, res, next) => {});

  return zely;
}
