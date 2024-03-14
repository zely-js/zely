import { ZeptServer } from '@zely-js/http';
import { UserConfig } from './config';

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
  server: ZeptServer;
  applyZelyMiddlewares: (serverInstance: ZeptServer) => void;
}>;
export function productionBuild(options: UserConfig): Promise<void>;
