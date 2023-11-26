import * as url from 'node:url';
import { Zely } from 'zely';
import * as config from './config.js';

async function start() {
  process.chdir(url.fileURLToPath(new URL('.', import.meta.url)));
  Zely({
    ...config,
  });
}

start();
