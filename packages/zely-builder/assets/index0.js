import * as url from 'node:url';
import { Zely, showListen } from 'zely';
import config from './config.js';

process.chdir(url.fileURLToPath(new URL('.', import.meta.url)));

const port = config.port || 3000;

const app = Zely({
  ...config,
});

app.then((server) => {
  server.listen(port, () => {
    showListen(port);
  });
});
