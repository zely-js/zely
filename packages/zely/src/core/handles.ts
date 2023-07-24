/* eslint-disable no-loop-func */
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { existsSync, readFileSync } from 'fs';
import { join, relative } from 'path';

import { prettyURL } from '$zely/lib/pretty-url';
import { ObjectkeysMap } from '$zely/lib/chageKeys';
import { pathToRegexp } from '$zely/lib/pathToRegexp';

import { CACHE_DIRECTORY } from '../constants';
import { error, errorWithStacks, parseError } from '../logger';
import { Config } from '../config';
import { ServerDataHandler, ZelyRequest, ZelyResponse } from '$zely/types';

export async function send(value: any, res: ZelyResponse) {
  switch (typeof value) {
    case 'string':
      await res.send(value);
      break;

    case 'number':
      await res.send((value as number).toString());
      break;

    case 'bigint':
      await res.send((value as bigint).toString());
      break;

    case 'boolean':
      await res.send(String(value));
      break;

    case 'undefined':
      await res.send('undefined');
      break;

    case 'object':
      await res.send(JSON.stringify(value));
      break;

    default:
      error(`unsupported type: ${typeof value}`);
      break;
  }
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
  config: Config
) {
  const parsed = url.parse(req.url);

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

        for await (const pageHandler of Object.keys(page.m)) {
          // export default [];

          if (page.m.default) {
            const execd = new URL(req.url, `http://${req.headers.host}`).pathname.match(
              pattern
            );
            const pageModule = page.m.default;
            const $page = page.m.$page || {};

            // assign parameters.

            if (!req.params) req.params = {};

            params.forEach((param, index) => {
              req.params[param] = execd[index + 1] || null;
            });

            // send

            const processHandler = async (m: ServerDataHandler | object) => {
              const sendData = async (data) => {
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
                    await send(data.body, res as ZelyResponse);
                  }
                } else {
                  // function => object

                  isSended = true;
                  await send(data, res as ZelyResponse);
                }
              };

              if (typeof m === 'function') {
                // function handler

                const output = await m(req as ZelyRequest, res as ZelyResponse);

                // console.log(output);

                sendData(output);
              } else {
                // just object
                sendData(m);
                // console.log(isSended, req.url);
              }
            };

            if ($page.before) await $page.before(req, res);

            if (typeof pageModule === 'object') {
              // array
              if (Array.isArray(pageModule)) {
                for await (const m of pageModule) {
                  await processHandler(m);
                }
              } else {
                await processHandler(pageModule);
              }
            } else {
              await processHandler(pageModule);
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
              const stacks = parseError(e);

              errorWithStacks(e.message, stacks);

              const stackedFile = relative(
                process.cwd(),
                stacks[0].loc.slice(1, -1).split(':').slice(0, 2).join(':')
              );

              console.log(stacks);

              // console.log(relative(process.cwd(), page.modulePath));

              if (stackedFile === relative(process.cwd(), page.modulePath)) {
                error(
                  `[tracer] Error occurred in ${
                    prettyURL(
                      join(config.routes || 'pages', page.origin).replace(/\\/g, '/')
                    ).cyan
                  }`
                );
              }
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
