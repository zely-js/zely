const { GET } = require('zely/methods');

/**
 * @satisfies {import("zely").PageHandler[]}
 */
module.exports = [GET({ title: 'Zely App' })];
