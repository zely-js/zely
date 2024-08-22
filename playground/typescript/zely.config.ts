import { createVirtualPage, GET } from '@zely-js/core';
import { defineConfig } from '@zely-js/zely';

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
});
