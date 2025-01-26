import { ALL, response } from '@zely-js/core';

export default [
  ALL(() => {
    throw new Error('Hello1111');
    const res = response({ msg: '👋' }, {});
    res.body = { msg: '🎉' };
    res.headers = {};
    res.status = 500;
    return res;
  }),
];
