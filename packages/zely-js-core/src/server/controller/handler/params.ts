import { ZelyRequest } from '~/zely-js-core/types';

export function applyParams(req: ZelyRequest, pattern: RegExp, params: string[]) {
  if (!pattern) return req;

  const execd = new URL(req.url, `http://${req.headers.host}`).pathname.match(pattern);

  // assign parameters.

  if (!(req as any).params) (req as any).params = {};

  params.forEach((param, index) => {
    (req as any).params[param] = execd[index + 1] || null;
  });

  return req;
}
