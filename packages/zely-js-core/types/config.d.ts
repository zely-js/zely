import { Config as ServerOptions } from 'senta';
import { Loader } from './loader';

import { Middleware } from './middleware';
import { CompilerOptions } from 'serpack';

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

  /**
   * Experimental features
   */
  experimental?: ExperimentalFeatures;

  build?: {
    dist?: string;
    bundle?: boolean;
  };
}

export interface ExperimentalFeatures {
  /**
   * use enhanced html renderer.
   *
   * to use this feature, you need to install dependency.
   *
   * `npm i segify --save-dev`
   *
   * https://segify.vercel.app/
   */
  useHTML?: boolean;

  /** use serpack compiler instead of `@zely-js/esbuild-loader` */
  useSerpack?: boolean;
  /** https://github.com/do4ng/serpack#compile */
  serpackOptions?: CompilerOptions;
}
