import { error } from '@zely-js/logger';

import { Server } from '../types';
import { Config } from '../types/config';

export async function applyServer(server: Server, config: Config) {
  const plugins = config.plugins || [];

  await Promise.all(
    plugins.map(async (plugin) => {
      try {
        if (plugin.server) {
          await plugin.server(server);
        }
      } catch (e) {
        error(`[${plugin.name}] error occured while running plugin: ${e.message}`);
      }
    })
  );

  return config;
}

export async function applyConfig(config: Config) {
  const plugins = config.plugins || [];

  await Promise.all(
    plugins.map(async (plugin) => {
      try {
        if (plugin.config) {
          // apply config
          const pluginConfig = (await plugin.config(config)) || {};

          config = {
            ...config,
            ...pluginConfig,
          };
        }
      } catch (e) {
        error(`[${plugin.name}] error occured while running plugin: ${e.message}`);
      }
    })
  );

  return config;
}
