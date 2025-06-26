const { defineConfig } = require('zely');

module.exports = defineConfig({
  plugins: [require('@zely-js/static').staticPlugin('/static', './static')],
});
