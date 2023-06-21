const express = require('express');
const zely = require('zely');

async function createServer() {
  const middleware = await zely.middleware({
    server: {
      middlewareMode: true,
    },
  });

  const app = express();

  app.use(middleware);

  app.listen(3000, () => {
    zely.showListen(3000);
  });
}

createServer();
