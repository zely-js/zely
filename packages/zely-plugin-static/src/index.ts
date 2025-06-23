import mime from 'mime-types';
import { mkdirSync } from 'fs';
import path from 'path';
import fs from 'fs/promises';
import type { Config, Plugin } from '~/zely-js/types';
import { clone } from './lib';

interface StaticOptions {
  disableCopyDirectory?: boolean;
}

let globalConfig: Config = {};

export function staticPlugin(
  prefix: string,
  directory: string,
  options?: StaticOptions
): Plugin {
  return {
    name: '@zely-js/static',

    config(config) {
      globalConfig = config as any;
      return config;
    },

    async afterBuild(out) {
      if (options?.disableCopyDirectory) return;
      const cwd = globalConfig?.cwd || process.cwd();

      const absDirectory = path.resolve(cwd, directory);
      const relativeToCwd = path.relative(cwd, absDirectory);

      const targetDir = path.resolve(out, relativeToCwd);

      mkdirSync(targetDir, { recursive: true });

      clone(absDirectory, targetDir);
    },

    async server(server) {
      server.use(async (ctx, next) => {
        console.log(ctx.pathname);
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
