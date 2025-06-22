const { defineConfig } = require('zely');

module.exports = defineConfig({
  globalImport: true,
  plugins: [require('@zely-js/static').staticPlugin('/static', './static')],
});
