import { ALL } from '@zely-js/core';
import { setTimeout } from 'timers/promises';

export default [
  ALL<string>(async (ctx) => {
    const { data } = await $store(async () => {
      await setTimeout(1000);
      return 'Hello!';
    });

    return data;
  }),
];
