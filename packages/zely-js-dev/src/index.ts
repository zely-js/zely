import { Plugin, usePrewrite } from 'zely';
import { generatePage } from './components/index.html';

export function devtool(): Plugin {
  return {
    name: 'zely:devtool',
    server(server) {
      server.use((req, res, next) => {
        // @ts-ignore

        usePrewrite(res, async (data) => {
          res.statusCode = 500;
          // check is client browser

          if (req.headers['user-agent']?.includes('Mozilla/5.0')) {
            // replace chunk with response

            return await generatePage(data);
          }

          return data;
        });

        next();
      });
    },
  };
}
