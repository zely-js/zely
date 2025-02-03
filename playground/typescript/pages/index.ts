import { ALL, response } from '@zely-js/core';

export default [
  ALL((ctx) => {
    console.log(ctx.body);
    console.log(__dirname, __filename);
    const res = response({ msg: '👋' }, {});
    res.body = { msg: '🎉' };
    res.headers = {};
    res.status = 500;
    return res;
  }),
];
