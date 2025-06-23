import { Plugin } from 'zely';

interface StaticOptions {
  disableCopyDirectory?: boolean;
}
export function staticPlugin(
  prefix: string,
  directory: string,
  options?: StaticOptions
): Plugin;
