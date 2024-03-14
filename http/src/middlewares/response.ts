import { Middleware } from '../../types';

/*

res.json
res.send
res.status

*/

const MiddlewareResponse: Middleware = (req, res, next) => {
  res.json = (data: any) => {
    res.setHeader('Content-Type', 'text/json');
    res.end(JSON.stringify(data));

    return res;
  };

  res.send = (data: any) => {
    res.end(data);

    return res;
  };

  res.status = (code: number) => {
    res.statusCode = code;

    return res;
  };

  next();
};

export { MiddlewareResponse };
