import { defineConfig } from '@zely-js/zely';

export default defineConfig({
  allowAutoMiddlewares: true,
  onError(err) {
    console.log('ERROR' + err);
  },
  enableReporter: false,
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
