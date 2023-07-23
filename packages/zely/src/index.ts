import { error } from './logger';

Symbol('zely:handler');

// config
export * from './config';
export * from './define-config';

// constants
export * from './constants';

// core
export * from './core';

// typescript loader
export * from './loader';

// server
export * from './server/index';

export { exportServer } from './export';

export * from './show-listen';

export * from './server/middlewaremode';
export * from './snatcher';

export * from './apply-plugins';
export * from './prewrite';
export * from './support';

export * from './core/methods';

// no esm

if (__ESM__) {
  error('use cjs.');
  process.exit(1);
}
