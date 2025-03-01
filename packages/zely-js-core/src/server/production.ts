import { error } from '@zely-js/logger';
import { pathToRegexp } from '@zept/path-regexp';

import { performance } from 'node:perf_hooks';
import { join, relative } from 'node:path';

import { readDirectory } from '~/zely-js-core/lib/read-directory';
import type { UserConfig } from '~/zely-js-core';
import { transformFilename } from '~/zely-js-core/lib/file-to-path';
import { removeExtension } from '~/zely-js-core/lib/ext';

import { PageCache } from './controller';
import { filenameToRoute } from './server';

export async function productionBuild(options: UserConfig) {
  // exit early if no options provided
  if (!options) {
    error(new Error('config must be provided'));
    process.exit(1);
  }

  const files = readDirectory(join(options.cwd || process.cwd(), 'pages'));
  const pages = new PageCache(
    filenameToRoute(
      files.map((file) => {
        const relativePath = relative(join(options.cwd || process.cwd(), 'pages'), file);
        const path = transformFilename(removeExtension(relativePath), true);

        return {
          filename: relativePath.replace(/\\/g, '/'),
          regex: null,
          params: null,
          path,
          id: performance.now(),
          module: {
            type: 'unknown',
            isLoaded: false,
          },
        };
      })
    ).map((file) => {
      const outregex = pathToRegexp(file.path);

      return {
        ...file,
        regex: outregex.pattern,
        params: outregex.params,
      };
    }),
    options
  );

  await pages.productionBuild();
}
