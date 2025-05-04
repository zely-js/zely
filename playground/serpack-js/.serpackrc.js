const { optimizer } = require('@zely-js/optimizer');

/** @type {import("serpack").Options} */
module.exports = {
  compilerOptions: {
    // You can store server data automatically using @zely-js/optimizer plugin.
    // See more - https://zely.vercel.app/docs/server-data
    plugins: [optimizer()],
  },
};
