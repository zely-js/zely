import { pathToRegexp } from '@zept/path-regexp';
import { removeExtension } from '../../lib/ext';
import { transformFilename } from '../../lib/file-to-path';
import { PageModule } from '../../types/virtuals';
import { Page, isExportDefault } from './controller';

export function createVirtualPage(filename: string, pageModule: PageModule): Page {
  const path = transformFilename(removeExtension(filename), true);
  const outregex = pathToRegexp(path);

  return {
    filename,
    id: -1,
    path,
    regex: outregex.pattern,
    params: outregex.params,
    module: {
      __isVirtual__: true,
      isLoaded: true,
      type: isExportDefault(pageModule) ? 'export-default' : 'export',
      data: pageModule,
    },
  };
}
