import type { Context } from '@zely-js/core';
import type { Plugin as ZelyPlugin } from '@zely-js/zely';
import type { CompilerOptions, Plugin } from 'serpack';

export interface OptimizerOptions {}

export function optimizer(options?: OptimizerOptions): Plugin;
export function $serpack_cache(value: any, context: Context, name: string): Promise<any>;
export function zelyOptimizer(): ZelyPlugin;
