import { createVirtualPage, GET } from '@zely-js/core';
import { defineConfig } from '@zely-js/zely';

export default defineConfig({
  server: { port: 3001 },
  allowAutoMiddlewares: true,
  __virtuals__: [
    createVirtualPage('main.ts', [
      GET(() => {
        throw new Error("I'm a error");
        return 'Hello World~';
      }),
    ]),
  ],
});
