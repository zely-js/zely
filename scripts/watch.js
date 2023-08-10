const { watch } = require('asto');
const base = require('./base');

watch(base, {
  onChange: (path) => {
    console.log(path);
  },
  watchOptions: {
    ignored: ['**/node_modules', '**/dist'],
  },
});
