import { POST } from '@zely-js/zely';

export default [
  POST((ctx) => {
    ctx.send(`Hello, ${ctx.request.body.name}!`);
  }),
];
