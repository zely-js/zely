import { Middleware } from '../../types';

/*

url: /favicon.ico

*/

const MiddlewarePreventFavicon: Middleware = (req, res, next) => {
  if (req.url === '/favicon.ico') {
    return;
  }

  next();
};

export { MiddlewarePreventFavicon };
