import type { Context } from '@zely-js/core';

export function get(ctx: Context) {
  ctx.send({ hello: 'world', ctx: ctx.params });
}
