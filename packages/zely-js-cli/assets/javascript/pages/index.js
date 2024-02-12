module.exports = [
  GET((ctx) => {
    ctx.send({ message: 'Hello World!' });
  }),
];
