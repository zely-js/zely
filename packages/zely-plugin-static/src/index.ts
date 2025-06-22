import mime from 'mime-types';
import path from 'path';
import fs from 'fs/promises';
import type { Plugin } from '~/zely-js/types';

export function staticPlugin(prefix: string, directory: string): Plugin {
  return {
    name: '@zely-js/static',

    async server(server) {
      server.use(async (ctx, next) => {
        if (!ctx.pathname.startsWith(prefix)) {
          return next();
        }

        const filePath = path.join(directory, ctx.pathname.slice(prefix.length));

        try {
          const stat = await fs.stat(filePath);
          if (stat.isDirectory()) {
            ctx.status(403);
            ctx.send('Directory access forbidden');
            return;
          }

          const content = await fs.readFile(filePath);
          const mimeType = mime.lookup(filePath) || 'application/octet-stream';

          ctx.set('Content-Type', mimeType);
          ctx.status(200);
          ctx.response.end(content);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          ctx.status(404);
          ctx.send('File not found');
        }
      });
    },
  };
}
