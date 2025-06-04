import { setTimeout } from 'timers/promises';

module.exports = [
  GET(async (ctx) => {
    // Use $store to cache the result of a time-consuming function
    // https://zely.vercel.app/docs/server-data
    const message = await $store(
      async () => {
        await setTimeout(1000);

        return `Hello, ${ctx.params.name}!`;
      },
      // Cache is separated by different values of ctx.params.name
      [ctx.params.name]
    );

    ctx.send(message);
  }),
];
