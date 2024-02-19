import { ServerOptions, ZeptServer } from '@zept/http';
import { Loader } from '@zely-js/loader';

import { Middleware } from './middleware';

export interface UserConfig {
  server?: {
    port?: number;
    options?: ServerOptions;
    zept?: ZeptServer;
  };

  cwd?: string;

  middlewares?: Middleware[];
  allowAutoMiddlewares?: boolean;
  middlewareDirectory?: string;

  /**
   * Loader for Typescript/Javascript
   */
  loaders?: Loader[];

  /**
   * output directory
   * @default .zely
   */
  dist?: string;

  /**
   * Import methods automatically
   */
  globalImport?: boolean;

  /**
   * @param err Error message
   * @returns {void}
   */
  onError?: (err: Error) => void | Promise<void>;

  /**
   * enable or disable logging error messages.
   * @default true
   */
  enableReporter?: boolean;
}
