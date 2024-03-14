import url from 'node:url';
import { createReadStream, existsSync } from 'node:fs';
import { lookup } from 'mime-types';

import type { Request, Response } from '@zely-js/http';

export function apply(req: Request, res: Response) {
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

  // res.sendFile

  (res as any).sendFile = (filePath: string) => {
    const mime = lookup(filePath) || 'text/plain';

    if (existsSync(filePath)) {
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Disposition': `attachment; filename=${filePath}`,
      });

      createReadStream(filePath).pipe(res);
    } else {
      throw new Error(`no such file or directory. ${filePath}`);
    }

    return res;
  };
}
export function kitMiddleware(req: Request, res: Response, next: () => void) {
  apply(req, res);

  next();
}
