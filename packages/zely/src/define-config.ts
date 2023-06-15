import { Config } from './config';
import { DEFAULT_CONFIG } from './constants';

function assign(c: Config): Config {
  return {
    ...DEFAULT_CONFIG,
    ...c,
    __independent: true,
  } as any;
}
export function defineConfig(config: Config) {
  const r = assign(config);
  return r;
}
