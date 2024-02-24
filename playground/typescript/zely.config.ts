import { defineConfig } from '@zely-js/zely';

export default defineConfig({
  allowAutoMiddlewares: true,
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
