export default [
  GET(async (ctx) => {
    // Use $store to cache the result of a time-consuming function
    // https://zely.vercel.app/docs/caching
    const { data } = await $store(async () => {
      const host = ctx.request.headers.host ?? 'localhost:3000';
      const url = `http://${host}/static/static.txt`;

      // If your node version is lower than 18,
      // download a fetch package such as node-fetch and run this code.
      const response = await fetch(url);
      const text = await response.text();

      return text;
    }, ctx);
    // Cache is separated by different values of ctx.params

    ctx.send(`${data}, ${ctx.params.name}`);
  }),
];
