import { Config } from '@zely-js/zely';

export default {
  plugins: [
    {
      name: 'error',
      server: (server) => {
        server.use((req, res, next) => {
          console.log(req.url);
          next();
        });
      },
    },
  ],
} as Config;
