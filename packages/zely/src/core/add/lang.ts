import { existsSync } from 'fs';

export function usingLanguage(): 'js' | 'ts' {
  if (existsSync('zely.config.ts')) return 'ts';
  return 'js';
}
