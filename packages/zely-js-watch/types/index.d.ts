import chokidar from 'chokidar';

export interface WatchOptions {
  chokidar?: chokidar.WatchOptions;
  includes?: string[];
}

/**
 *
 * @param options watch options
 * @param zely zely config
 */
export function watch(options: WatchOptions, zely: any): void;
