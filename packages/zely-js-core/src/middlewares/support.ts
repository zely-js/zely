import { createReadStream, existsSync } from 'node:fs';
import { lookup } from 'mime-types';
import { Context } from 'senta';

export function apply(ctx: Context) {
  // req.query
  // ?foo=bar => {"foo":"bar"}
  // provided by senta

  // res.html
  // ctx.html("<p>ABCD</p>")
  (ctx as any).html = (code: string) => {
    ctx.response.setHeader('Content-Type', 'text/html');
    ctx.response.end(code);
    return ctx;
  };

  // res.send
  // res.send("text")
  // same: res.end
  // (res as any).send = res.end;
  // replaced: prewrite (/packages/zely/src/core/handles.ts)

  // res.status
  // res.status(404).send("not found")
  // provided by senta

  // ctx.sendFile

  (ctx as any).sendFile = (filePath: string) => {
    const mime = lookup(filePath) || 'text/plain';

    if (existsSync(filePath)) {
      ctx.response.writeHead(200, {
        'Content-Type': mime,
        'Content-Disposition': `attachment; filename=${filePath}`,
      });

      createReadStream(filePath).pipe(ctx.response);
    } else {
      throw new Error(`no such file or directory. ${filePath}`);
    }

    return ctx;
  };
}
export function kitMiddleware(ctx: Context, next: () => void) {
  apply(ctx);

  next();
}
