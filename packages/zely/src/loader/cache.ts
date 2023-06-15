import { existsSync, readdirSync, rmSync, statSync } from 'fs';
import { join } from 'path';
import { CACHE_DIRECTORY } from '../constants';

export async function getDirectorySize(dir) {
  const files = await readdirSync(dir, { withFileTypes: true });

  const paths = files.map(async (file) => {
    const path = join(dir, file.name);

    if (file.isDirectory()) return await getDirectorySize(path);

    if (file.isFile()) {
      const { size } = await statSync(path);

      return size;
    }

    return 0;
  });

  return (await Promise.all(paths)).flat(Infinity).reduce((i, size) => i + size, 0);
}

/**
 * get cache directory size. (`node_modules/.zely`)
 * @returns MB
 */
export async function getCacheSize() {
  if (!existsSync(CACHE_DIRECTORY)) return 0;

  return ((await getDirectorySize(CACHE_DIRECTORY)) / (1024 * 1024)).toFixed(2);
}

export function removeCache() {
  rmSync(CACHE_DIRECTORY, { force: true, recursive: true });
}
