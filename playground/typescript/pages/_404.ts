import { GET } from '@zely-js/core';

export default [
  GET((ctx) => {
    ctx.status(404).send({ error: `${ctx.pathname} not found`, code: 404 });
  }),
];
