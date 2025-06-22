import { createVirtualPage, defaultSender, GET, setSender } from '@zely-js/core';
import { defineConfig } from '@zely-js/zely';
import { staticPlugin } from '@zely-js/static';

import { bodyMiddleware } from '@zely-js/zely/middlewares';

setSender(async (req, res, chunk, status) => {
  defaultSender(req, res, chunk, status);
});

export default defineConfig({
  server: { port: 3001 },
  experimental: {
    useHTML: true,
  },
  allowAutoMiddlewares: true,
  plugins: [staticPlugin('/static', './pages')],
  middlewares: [bodyMiddleware],
  __virtuals__: [createVirtualPage('main.ts', [GET(() => {})])],
});
