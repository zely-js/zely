import { existsSync } from 'node:fs';

export function usingLanguage(): 'js' | 'ts' {
  if (existsSync('zely.config.ts')) return 'ts';
  return 'js';
}
