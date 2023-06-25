import { Plugin } from 'vite';
import { middleware, getConfig } from 'zely';

import { Config } from '$zely/types';

export function vitePluginZely(options?: Config): Plugin {
  return {
    name: 'vite-plugin-zely',

    async configureServer(server) {
      if (options?.server) {
        throw new Error("[vite-plugin-zely] options.server isn't supported.");
      }

      const zely = await middleware({
        ...options,
        ...((await getConfig()) || {}),
        server: {
          middlewareMode: true,
        },
      });

      zely.forEach((middlewareFn) => {
        console.log(middlewareFn.toString());
        server.middlewares.use(middlewareFn);
      });
    },
  };
}
