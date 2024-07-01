import { IncomingMessage, Server, ServerResponse } from 'http';

import { Middleware, ServerConstructorOptions, ServerOptions } from '../../types';

import { defaultServer } from './default';

import {
  MiddlewareBody,
  MiddlewarePreventFavicon,
  MiddlewareQueryString,
  MiddlewareResponse,
} from '../middlewares';

export class ZeptServer {
  options: ServerOptions;

  middlewares: Middleware[];

  processor: Middleware[];

  server: Server;

  constructor(options?: ServerConstructorOptions) {
    this.options = {
      // default http server
      server: defaultServer(),
      useApi: true,

      ...options,
    };

    this.middlewares = [];
    this.processor = [];

    this.use(MiddlewareBody, MiddlewareQueryString, MiddlewareResponse);

    if (!this.options.requestFavicon) {
      this.use(MiddlewarePreventFavicon);
    }

    this.server = this.options.server.createServer((req, res) => {
      this.handle(req, res);
    });
  }

  use(...middlewares: Middleware[]) {
    middlewares.forEach((middleware) => {
      // check is function
      if (typeof middleware !== 'function') {
        // console.error('middleware must be function.');
      } else {
        this.middlewares.push(middleware);
      }
    });

    return this;
  }

  useProcessor(...processors: Middleware[]) {
    processors.forEach((processor) => {
      // check is function
      if (typeof processor !== 'function') {
        // console.error('middleware must be function.');
      } else {
        this.processor.push(processor);
      }
    });

    return this;
  }

  async handle(req: IncomingMessage, res: ServerResponse) {
    if (this.middlewares.length === 0) return;

    const middlewares = this.middlewares.concat(this.processor);

    let index = -1;

    const loop = async () => {
      if (index < middlewares.length && !res.writableEnded) {
        const middleware = middlewares[(index += 1)];

        if (middleware) {
          await middleware(req as any, res as any, loop);
        }
      }
    };

    loop();
  }

  listen(port: number, callback?: () => void | Promise<void>) {
    this.server.listen(port, callback);

    return this;
  }
}
