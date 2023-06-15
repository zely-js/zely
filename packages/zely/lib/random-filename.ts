import { join, parse } from 'path';
import generateRandomString from './random';

export default function randomFilename(original: string): string {
  const { dir, name } = parse(original);

  return join(dir, `${name}.${generateRandomString()}.js`);
}
