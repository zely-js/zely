import { ServerOptions } from '@zept/http';
import { Loader } from '@zely-js/loader';

import { Middleware } from './middleware';

export interface UserConfig {
  server?: {
    port?: number;
    options?: ServerOptions;
  };

  cwd?: string;

  middlewares?: Middleware[];
  allowAutoMiddlewares?: boolean;
  middlewareDirectory?: string;

  /**
   * Loader for Typescript/Javascript
   */
  loader?: Loader;

  /**
   * output directory
   * @default .zely
   */
  dist?: string;
}
