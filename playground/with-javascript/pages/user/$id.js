const { GET } = require('zely/methods');

const users = {
  1: { name: 'anonymous #1', about: 'I love cat.' },
  2: { name: 'anonymous #2', about: 'Hello.' },
  3: { name: 'anonymous #3', about: 'Awesome.' },
};

/**
 * @satisfies {import("zely").PageHandler[]}
 */
module.exports = [
  GET((ctx) => {
    ctx.json(users[ctx.params.id]);
  }),
];
