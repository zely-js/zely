// This file is an example of caching server data (powered by @zely-js/optimizer).
// See more: https://zely.vercel.app/docs/server-data

import { setTimeout } from 'timers/promises';

async function $greeting(name: string) {
  await setTimeout(1000);
  return `Hello, ${name}!`;
}

export default [
  GET(async (ctx) => {
    const message = await $greeting(ctx.params.name);
    ctx.send(message);
  }),
];
