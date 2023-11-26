import { relative } from 'node:path';
import { load as loader } from '$zely/require';
import { typescriptLoader } from '.';

export async function load(target: string) {
  if (target.endsWith('.ts')) {
    return await typescriptLoader(target);
  }
  return { filename: null, m: await loader(relative(__dirname, target)) };
}
