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

export function handles(
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

  routes.forEach((page) => {
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

        // check method

        Object.keys(page.m).forEach(async (pageHandler) => {
          // "all"

          if (pageHandler === req.method.toLowerCase() || pageHandler === 'all') {
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

                await target[pageHandler](req, res);

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
        });
      }
    }
  });

  // 404
  if (!isSended && res.writable) {
    if (config.error) config.error(req, res);
    else res.statusCode = 404;
  }
}
