import { defineConfig } from 'zely/config';

export default defineConfig({
  routes: './pages',

  // auto middleware mode
  // https://zely.netlify.app/guide/middlewares#auto-mode

  allowAutoMiddlewares: true,
  middlewareDirectory: './middlewares',

  prebuild: true,

  // 404 page
  // https://zely.netlify.app/guide/routing#404-page

  plugins: [
    {
      name: 'fn-0.1',
      config(config) {
        config.error = (req, res) => {
          res.statusCode = 404;

          res.end('404 page not found');
        };
      },
    },
  ],
});
