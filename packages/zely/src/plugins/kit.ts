import url from 'url';
import http from 'http';

import { Plugin } from '../config';
import { snatcher } from '../snatcher';

// https://github.com/do4ng/zely/issues/11
// original: https://github.com/do4ng/zely/tree/main/packages/plugin-kit

export type Req = http.IncomingMessage;
export type Res = http.ServerResponse;

export function apply(req: Req, res: Res) {
  // req.query
  // ?foo=bar => {"foo":"bar"}
  (req as any).query = Object.fromEntries(
    new URLSearchParams(url.parse(req.url).query || '')
  );

  // res.html
  // res.html("<p>ABCD</p>")
  (res as any).html = (code: string) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(code);
    return res;
  };

  // res.send
  // res.send("text")
  // same: res.end
  // (res as any).send = res.end;
  // replaced: prewrite (/packages/zely/src/core/handles.ts)

  // res.status
  // res.status(404).send("not found")
  (res as any).status = (code: number) => {
    res.statusCode = code;
    return res;
  };

  /* snatcher */
  // https://zely.netlify.app/guide/fetch

  const devSnatch = snatcher(req, res);

  (req as any).snatch = devSnatch;
}
export function kitMiddleware(req: Req, res: Res, next: () => void) {
  apply(req, res);

  next();
}

export function kit(): Plugin {
  return {
    name: '@zely/plugin-kit',
    server(server) {
      // eslint-disable-next-line no-unused-vars
      server.use((req, res, next) => {
        apply(req, res);

        next();
      });
    },
  };
}
