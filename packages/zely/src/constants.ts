import { join } from 'node:path';

import { Config } from './config';

export const CACHE_DIRECTORY = join(process.cwd(), '.zely');
export const DEFAULT_CONFIG: Config = {
  port: 3000,
  routes: './pages',
  middlewares: [],
  base: '.',
  esbuild: {},

  // auto middleware mode
  middlewareDirectory: './middlewares/',
  allowAutoMiddlewares: false,

  server: {
    middlewareMode: false,
  },
};

export const CACHE_FILE = join(CACHE_DIRECTORY, 'cache.json');
export const MIDDLEWARE_CACHE_FILE = join(CACHE_DIRECTORY, 'cache.middleware.json');
export const CACHE_VERSION = '230411';
