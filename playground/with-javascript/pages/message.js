const { GET } = require('zely/methods');

/**
 * @satisfies {import("zely").PageHandler[]}
 */
module.exports = [
  GET((ctx) => {
    // If you do not run a typescript type checker, delete the comment below.
    // @ts-ignore
    ctx.json({ message: ctx.request.message });
  }),
];
