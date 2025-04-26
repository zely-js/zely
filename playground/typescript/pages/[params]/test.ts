import { GET } from '@zely-js/core';
import { setTimeout } from 'timers/promises';

async function $greeting(name: string) {
  await setTimeout(1000);
  return `Hello, ${name}!`;
}

export default [
  GET(async (ctx) => {
    const message = await $greeting(ctx.params.params);

    ctx.send(message);
  }),
];
