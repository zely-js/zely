import { ALL } from '@zely-js/core';
import { setTimeout } from 'timers/promises';

export default [
  ALL<string>(async (ctx) => {
    ctx.debug('Meeessage');
  }),
];
