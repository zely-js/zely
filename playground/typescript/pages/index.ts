import { ALL, response } from '@zely-js/core';

export default [
  ALL(() => {
    console.log(__dirname, __filename);
    const res = response({ msg: '👋' }, {});
    res.body = { msg: '🎉' };
    res.headers = {};
    res.status = 500;
    return res;
  }),
];
