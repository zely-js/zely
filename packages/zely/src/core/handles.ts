/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-loop-func */
import url from 'node:url';
import { IncomingMessage, ServerResponse } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ObjectkeysMap } from '$zely/lib/chageKeys';
import { pathToRegexp } from '$zely/lib/pathToRegexp';
import { ServerDataHandler, ZelyRequest, ZelyResponse } from '$zely';

import { CACHE_DIRECTORY } from '../constants';
import { Config } from '../config';
import { Context } from '../server/context';
import { errorHandler } from './error';

export async function send(chunk: any, res: ZelyResponse) {
  if (res.writableEnded) return;

  res.send(chunk);
}

export async function handles(
  req: IncomingMessage,
  res: ServerResponse,
  routes: {
    file: string;
    m: any;
    modulePath: string;
    type: string;
    origin: string;
  }[],
  config: Config,
  props?: any
) {
  const parsed = url.parse(req.url);
  const staticProps =
    props || JSON.parse(readFileSync(join(CACHE_DIRECTORY, 'static')).toString());

  // @ts-ignore
  res.json = function (data: any) {
    res.end(JSON.stringify(data));
  };

  if (parsed.pathname.startsWith('/.zely/')) {
    const target = join(CACHE_DIRECTORY, '../', parsed.pathname);

    if (existsSync(target)) {
      res.setHeader('Content-Type', 'text/javascript');
      res.end(readFileSync(target));
    } else {
      res.statusCode = 404;
      res.end(`Cannot read ${target}`);
    }
  }

  // is sended
  let isSended = false;

  for await (const page of routes) {
    // debug
    // console.log(page.file, isSended);

    if (isSended) {
      return;
    }

    const { pattern, params } = pathToRegexp(page.file, false);

    // console.log(pattern, parsed.pathname, pattern.test(parsed.pathname), page);

    // matched page

    if (pattern.test(parsed.pathname)) {
      if (page.type === 'html') {
        // html

        isSended = true;

        res.setHeader('Content-Type', 'text/html');
        res.end(page.m);
      } else {
        // module

        page.m = ObjectkeysMap(page.m, (key) => key.toLowerCase());

        (req as any).props = staticProps[page.origin];

        for await (const pageHandler of Object.keys(page.m)) {
          // export default [];

          if (page.m.default || page.m[0]?.__typeof === Symbol.for('zely:handler')) {
            const execd = new URL(req.url, `http://${req.headers.host}`).pathname.match(
              pattern
            );
            const pageModule = page.m.default || Object.values(page.m);
            const $page = page.m.$page || {};

            const context: Context = new Context(req as ZelyRequest, res as ZelyResponse);

            // assign parameters.

            if (!req.params) req.params = {};

            params.forEach((param, index) => {
              req.params[param] = execd[index + 1] || null;
            });

            // send

            const processHandler = async (m: ServerDataHandler | object) => {
              const sendData = async (data) => {
                try {
                  if (data?.__typeof === Symbol.for('zely:handler')) {
                    if (
                      data.__method.description.toLowerCase() ===
                        req.method.toLowerCase() ||
                      data.__method.description.toLowerCase() === 'all'
                    ) {
                      // function => handler object

                      isSended = true;
                      Object.keys(data.headers || {}).forEach((header) => {
                        res.setHeader(header, data.headers.header);
                      });

                      if (typeof data.body === 'function') {
                        await send(await data.body(context), res as ZelyResponse);
                      } else {
                        await send(data.body, res as ZelyResponse);
                      }
                    }
                  } else {
                    // function => object

                    isSended = true;
                    await send(data, res as ZelyResponse);
                  }

                  return null;
                } catch (e) {
                  return e;
                }
              };

              if (typeof m === 'function') {
                // function handler

                const output = await m(context);

                return sendData(output);
              }
              // just object
              return sendData(m);
              // console.log(isSended, req.url);
            };

            if ($page.before) await $page.before(req, res);

            if (typeof pageModule === 'object') {
              // array
              if (Array.isArray(pageModule)) {
                for await (const m of pageModule) {
                  await errorHandler(await processHandler(m));
                }
              } else {
                await errorHandler(await processHandler(pageModule));
              }
            } else {
              await errorHandler(await processHandler(pageModule));
            }

            if ($page.after) await $page.after(req, res);
          }

          // page functions
          // function get() {}

          if (
            (!isSended && pageHandler === req.method.toLowerCase()) ||
            pageHandler === 'all'
          ) {
            isSended = true;

            const execd = new URL(req.url, `http://${req.headers.host}`).pathname.match(
              pattern
            );

            // assign parameters.

            if (!req.params) req.params = {};

            params.forEach((param, index) => {
              req.params[param] = execd[index + 1] || null;
            });

            try {
              const target = page.m;
              const $page = page.m.$page || {};

              // console.log('response1' ;

              // response

              const next = async () => {
                // $page.before

                if ($page.before) await $page.before(req, res);

                const output = await target[pageHandler](req, res);

                if (!res.writableEnded && output) {
                  await send(output, res as ZelyResponse);
                }

                // $page.after

                if ($page.after) await $page.after(req, res);
              };

              // $page.use

              if ($page.use) {
                $page.use(req, res, next);
              } else {
                await next();
              }
            } catch (e) {
              errorHandler(e);
            }
          }
        }
      }
    }
  }

  // 404

  // console.log(req.url, isSended);
  if (!isSended && !res.writableEnded) {
    if (config.error) config.error(req, res);
    else res.statusCode = 404;
  }
}
