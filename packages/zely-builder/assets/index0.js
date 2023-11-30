import * as url from 'node:url';
import * as server from 'zely/server';
import { zept } from 'zept';

import _config from './config.js';
import routes from './routes.js';

process.chdir(url.fileURLToPath(new URL('.', import.meta.url)));

/**
 * @type {import("zely").Config}
 */
const config = {
  ..._config,
  routes: 'pages',
};

const app = zept([]);
const port = config.port || 3000;

server.applyPlugins(app, config);

for (const middleware of config.middlewares || []) {
  app.use(middleware);
}

if (config.allowAutoMiddlewares)
  console.log("[warning] @zely/builder doesn't support auto-middlewares");

app.use((req, res) => server.handles(req, res, routes, config));
app.listen(port, () => console.log(`Server is running~ - http://localhost:${port}/`));
