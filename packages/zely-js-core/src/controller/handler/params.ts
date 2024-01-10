import { ZelyRequest } from '~/zely-js-core/types';

export function applyParams(req: ZelyRequest, pattern: RegExp, params: string[]) {
  const execd = new URL(req.url, `http://${req.headers.host}`).pathname.match(pattern);

  // assign parameters.

  if (!req.params) req.params = {};

  params.forEach((param, index) => {
    req.params[param] = execd[index + 1] || null;
  });

  return req;
}
