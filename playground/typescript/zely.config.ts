import { createVirtualPage, GET } from '@zely-js/core';
import { defineConfig } from '@zely-js/zely';

export default defineConfig({
  allowAutoMiddlewares: true,
  __virtuals__: [
    createVirtualPage('main.ts', [
      GET(() => {
        return 'Hello World~';
      }),
    ]),
  ],
  plugins: [
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
