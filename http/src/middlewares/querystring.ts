import url from 'url';
import { Middleware } from '../../types';
import { queryToJson } from '../../lib/querytojson';

/*

url: /test?foo=bar

req.query: { "foo": "bar" }
req.querystring: foo=bar
req.search: ?foo=bar

*/

const MiddlewareQueryString: Middleware = (req, res, next) => {
  const { query, search } = url.parse(req.url);

  req.querystring = query;
  req.search = search;
  req.query = queryToJson(query);

  next();
};

export { MiddlewareQueryString };
