import { Plugin, usePrewrite } from 'zely';
import { generatePage } from './components/index.html';

export function devtool(): Plugin {
  return {
    name: 'zely:devtool',
    server(server) {
      server.use((ctx, next) => {
        usePrewrite(ctx.response, async (data) => {
          ctx.response.statusCode = 500;
          // check is client browser

          if (ctx.request.headers['user-agent']?.includes('Mozilla/5.0')) {
            // replace chunk with response

            return (await generatePage(data)).split(/\r?\n/).join('');
          }

          return data;
        });

        next();
      });
    },
  };
}
