import { ALL, response } from '@zely-js/core';

export default [
  ALL(() => {
    const res = response<{ name: string }>({ msg: 'Hello', name: '' }, {});

    res.headers = {};
    res.status = 500;

    return res;
  }),
];
