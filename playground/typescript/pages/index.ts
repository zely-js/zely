import { ALL, response } from '@zely-js/core';
import { setTimeout } from 'timers/promises';

async function $greeting() {
  await setTimeout(1000);
  return 'Hello!';
}

export default [
  ALL(async (ctx) => {
    const res = response<{ name: string }>({ msg: await $greeting(), name: '' }, {});

    res.headers = {};
    res.status = 200;

    console.log(ctx.request.body);
    return res;
  }),
];
