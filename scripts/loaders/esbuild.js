const { esbuildLoader } = require('asto');

module.exports = esbuildLoader({
  define: {
    __ESM: 'false',
  },
});
