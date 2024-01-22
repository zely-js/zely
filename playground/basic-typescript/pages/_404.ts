import { GET } from '@zely-js/core';

export default [
  GET((ctx) => {
    ctx.status(404).send({ error: 'Page Not Found', code: 404 });
  }),
];
