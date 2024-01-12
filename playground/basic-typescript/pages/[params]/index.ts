export default {
  all(ctx) {
    // console.log(ctx.params);
    ctx.send('Hello World!');
  },
  post(ctx) {
    ctx.send('Hello World! (post)');
  },
};
