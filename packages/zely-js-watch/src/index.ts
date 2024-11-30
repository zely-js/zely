import chokidar from 'chokidar';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { performance } from 'perf_hooks';
import { join, relative } from 'path';
import { info } from '@zely-js/logger';

import { WatchOptions } from '../types';
import type { UserConfig } from '~/zely-js-core/types';

export function watch(options: WatchOptions, zely: UserConfig) {
  if (!options?.includes) {
    options.includes = [];
  }
  if (!options?.target) {
    options.target = [];
  }

  options.target.push('ts', 'tsx', 'js', 'jsx', 'html');

  const hash = join(zely.cwd || process.cwd(), '.zely', 'pages.hash.json');
  const base = join(zely.cwd || process.cwd(), 'pages');

  options.includes.push(
    join(zely.cwd || process.cwd(), `pages/**/*.{${options.target.join(',')}}`).replace(
      /\\/g,
      '/'
    ),
    'zely.config.*'
  );

  const watcher = chokidar.watch(options.includes, options.chokidar);

  watcher.on('change', (path: string) => {
    if (path.includes('zely.config')) {
      info('zely.config edited. Please restart to reload server');
      return;
    }

    if (!existsSync(hash)) {
      writeFileSync(hash, JSON.stringify({}));
    }

    const cache = JSON.parse(readFileSync(hash, 'utf-8'));

    // info(`File added: ${path}`);

    cache[relative(base, path).replace(/\\/g, '/')] = performance.now();

    writeFileSync(hash, JSON.stringify(cache));
  });
}
