const { createZelyServer } = require('@zely-js/core');

process.env.NODE_ENV = 'development';

createZelyServer({
  plugins: [],
}).then((server) => {
  server.listen(3000);
});
