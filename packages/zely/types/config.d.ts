import { Config } from '.';

/**
 * Merge with default config
 * @param c Config
 */
export function assign(c: Config): Config;

/**
 * load local config file
 * ```txt
 * supported: `zely.config.js` `zely.config.ts`
 * ```
 * @param target
 */
export function getConfig(target?: string): Promise<Config>;

/**
 * define config
 * @param config user-config
 */
export function defineConfig(config: Config);

export function configDev(base: string, format?: 'esm' | 'cjs'): Promise<string | null>;
