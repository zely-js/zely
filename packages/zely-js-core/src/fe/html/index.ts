import { readFileSync } from 'fs';

import { UserConfig } from '~/zely-js-core/types';
import { useEnhancedHTML } from './enhanced';
import { useHTML } from './html';

export function compileHTML(filename: string, options: UserConfig = {}) {
  const page = readFileSync(filename, 'utf-8');
  if (options.experimental?.useHTML) {
    return useEnhancedHTML(page);
  }
  return useHTML(page);
}
