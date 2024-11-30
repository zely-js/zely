import { App } from 'senta';
import { UserConfig } from './config';
import { createLoader } from './loader';

export interface Page {
  filename: string;
  path: string;
  regex: RegExp;
  id: number;
  params: string[];

  module: {
    /**
     * "export"
     *
     * ~~ctx available in 3~~
     *
     * ```diff
     * - export function get(req, res) {}
     * + export function get(ctx) {}
     * ```
     * "export default"
     * ```ts
     * export default [(ctx) => {}];
     * ```
     */
    type: 'export' | 'export-default' | 'unknown';

    /**
     * zely@3 don't compile code before first request of specific page
     */
    isLoaded: boolean;

    /**
     * page module
     * `{"get": () => {...}}`
     */
    data?: any;

    builtPath?: string;
    builtMapPath?: string;
    builtAssets?: string[];

    __isVirtual__?: boolean;
  };
}

export class PageCache {
  #modules: Page[];
  config: UserConfig;
  loader: ReturnType<typeof createLoader>;
  constructor(page: Page[], config: UserConfig);
  productionBuild(): Promise<void>;
  writeIdMap(data: any): void;
  getPages(): Page[];
  readIdMap(): any;
  getModule(path: string): Promise<any>;
}

/**
 * create server instance
 *
 * ```ts
 * const { server, applyZelyMiddlewares } = await createZelyServer({});
 * applyZelyMiddlewares(server);
 * ```
 * @param options Config
 */
export function createZelyServer(options: UserConfig): Promise<{
  server: App;
  applyZelyMiddlewares: (serverInstance: App) => void;
  cache: PageCache;
}>;
export function productionBuild(options: UserConfig): Promise<void>;
