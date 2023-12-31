const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

module.exports.clone = (template, outfile) => {
  if (template === 'js') {
    // with-javascript

    const js = readFileSync(join(__dirname, './data/0.js'));

    writeFileSync(outfile, js);
  } else if (template === 'ts') {
    // with-typescript

    const ts = readFileSync(join(__dirname, './data/0.ts'));

    writeFileSync(outfile, ts);
  } else {
    console.log(`[@zely/plugin-cors] cannot find template "${template}"`);
  }
};

/**
 *
 * @param {*} options
 * @returns {import("zely").Plugin}
 */
module.exports.cors = (options) => ({
  name: '@zely/plugin-cors',
  server(server) {
    server.use(require('cors')(options));
  },
});
