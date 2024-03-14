import { ServerConstructorOptions } from '../types';

import { ZeptServer } from './server';

function osik(options?: ServerConstructorOptions) {
  return new ZeptServer(options);
}

export { osik, ZeptServer };

export * from './middlewares';
