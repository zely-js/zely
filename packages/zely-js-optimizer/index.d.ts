import type { CompilerOptions, Plugin } from 'serpack';

export interface OptimizerOptions {}

export function optimizer(options?: OptimizerOptions): Plugin;
