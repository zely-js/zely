import { createVirtualPage, GET } from '@zely-js/core';
import { defineConfig } from '@zely-js/zely';

import { bodyMiddleware } from '@zely-js/zely/middlewares';

export default defineConfig({
  server: { port: 3001 },
  experimental: {
    useHTML: true,
  },
  allowAutoMiddlewares: true,
  middlewares: [bodyMiddleware],
  __virtuals__: [createVirtualPage('main.ts', [GET(() => {})])],
});
