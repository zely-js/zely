import { ServerOptions, ZeptServer } from '@zely-js/http';
import { Loader } from '@zely-js/loader';

import { Middleware } from './middleware';

export interface UserConfig {
  /**
   * server options
   *
   * https://zely.vercel.app/apis/config#server-options
   */
  server?: {
    /**
     * Server port to use
     */
    port?: number;

    /**
     * HTTP server options
     *
     * [https://github.com/zely-js/zept/blob/main/packages/http/types/index.d.ts#L33](zept.ServerOptions)
     */
    options?: ServerOptions;

    /**
     * Server instance
     */
    zept?: ZeptServer;
  };

  /**
   * Base Directory
   */
  cwd?: string;

  /**
   *  Middlewares
   */
  middlewares?: Middleware[];

  /**
   * Allow to import middlewares automatically.
   *
   * https://zely.vercel.app/docs/auto
   */
  allowAutoMiddlewares?: boolean;

  /**
   * Directory including middlewares
   *
   * https://zely.vercel.app/docs/auto
   */
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

  /**
   *  Whether to enable the reporter for debugging. (reporter reports errors exactly through .js.map)
   */
  keepDist?: boolean;

  /**
   * Virtual Pages
   *
   * https://zely.vercel.app/apis/virtual-page
   */
  __virtuals__?: any[];
}
