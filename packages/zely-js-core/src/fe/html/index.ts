import { readFileSync } from 'fs';

import { UserConfig } from '~/zely-js-core/types';
import { useEnhancedHTML } from './enhanced';
import { useHTML } from './html';

export function compileHTML(filename: string, options: UserConfig = {}, props = {}) {
  const page = readFileSync(filename, 'utf-8');
  if (options.experimental?.useHTML) {
    return useEnhancedHTML(page, props);
  }
  return useHTML(page);
}
