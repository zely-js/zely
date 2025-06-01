import { ALL, response } from '@zely-js/core';
import { setTimeout } from 'timers/promises';

export default [
  ALL<string>(async (ctx) => {
    const { data } = await $store(async () => {
      await setTimeout(1000);
      return `Hello ${ctx.params.params}!`;
    }, [ctx.params.params]);

    return data || 'null';
  }),
];
