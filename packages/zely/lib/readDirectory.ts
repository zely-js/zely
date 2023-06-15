import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export function readDirectory(
  target: string,
  ignored: string[] = ['.git', 'node_modules']
): string[] {
  const files = readdirSync(target);
  const results = [];

  files.forEach((file) => {
    if (ignored.includes(file.trim())) {
      // nothing
    } else if (statSync(join(target, file)).isDirectory()) {
      results.push(...readDirectory(join(target, file)));
    } else {
      results.push(join(target, file));
    }
  });

  return results;
}
