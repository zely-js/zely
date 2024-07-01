import { createVirtualPage, GET } from '@zely-js/core';
import { defineConfig } from '@zely-js/zely';
import { devtool } from 'zely-dev';

export default defineConfig({
  server: { port: 3001 },
  allowAutoMiddlewares: true,
  __virtuals__: [
    createVirtualPage('main.ts', [
      GET(() => {
        return 'Hello World~';
      }),
    ]),
  ],
  plugins: [
    devtool(),
    {
      name: 'error',
      server: async (server) => {
        server.use((req, res, next) => {
          next();
        });
      },
    },
  ],
});
