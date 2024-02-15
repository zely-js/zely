import type { Context } from '@zely-js/core';

export function get(ctx: Context) {
  throw new Error('HELLOWORLD!');
  ctx.send({ hello: 'world' });
}
