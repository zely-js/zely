import { Middleware } from 'zely';

export const Message: Middleware = (req, res, next) => {
  (req as any).message = 'Hello World!';

  next();
};
