import { defineConfig } from 'zely/config';

import { Message } from './middlewares/message';

export default defineConfig({
  routes: './pages',

  // auto middleware mode
  // https://zely.netlify.app/guide/middlewares#auto-mode

  // allowAutoMiddlewares: true,
  // middlewareDirectory: './middlewares',

  middlewares: [Message],

  // 404 page
  // https://zely.netlify.app/guide/routing#404-page

  error(req, res) {
    res.statusCode = 404;

    res.end('404 page not found');
  },
});
