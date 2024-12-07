import { ChokidarOptions as ChokidarWatchOptions } from 'chokidar';

export interface WatchOptions {
  chokidar?: ChokidarWatchOptions;
  includes?: string[];
  target?: string[];
}

/**
 *
 * @param options watch options
 * @param zely zely config
 */
export function watch(options: WatchOptions, zely: any): void;
