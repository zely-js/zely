import { relative } from 'path';
import { typescriptLoader } from '.';

export async function load(target: string) {
  if (target.endsWith('.ts')) {
    return await typescriptLoader(target);
  }
  return { filename: null, m: require(relative(__dirname, target)) };
}
