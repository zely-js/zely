import { Middleware } from '../types';

export const bodyMiddleware: Middleware = (context, next) => {
  let body = '';

  context.request.on('data', (chunk) => {
    body += chunk.toString();
  });

  context.request.on('end', () => {
    try {
      context.body = JSON.parse(body || '{}');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      context.body = {};
    }

    context.request.body = context.body;

    next();
  });
};
