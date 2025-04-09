import { ALL, response } from '@zely-js/core';

export default [
  ALL((ctx) => {
    const res = response<{ name: string }>({ msg: 'Hello', name: '' }, {});

    res.headers = {};
    res.status = 200;

    console.log(ctx.request.body);
    return res;
  }),
];
