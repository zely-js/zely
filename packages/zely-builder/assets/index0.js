import { Zely } from 'zely';
import config from './config.js';

async function start() {
  process.chdir(__dirname); // set cwd
  Zely(config);
}

start();
