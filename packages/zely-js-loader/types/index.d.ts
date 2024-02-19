import { UserConfig } from '@zely-js/core';

export interface TransformOutput {
  /**
   * output file path
   */
  filename: string;

  /*
   * out map file path
   */
  map: string;
}

export interface TransformOptions<T = any> {
  type: 'page' | 'middleware' | 'configuration' | 'cache';
  buildOptions: T;
}

export interface LoaderFunc extends TransformOutput {
  module: any;
}

export interface Loader<T = any> {
  name: string;

  transform(
    id: string,
    source: string,
    options: TransformOptions<T>
  ): Promise<TransformOutput | null | void> | TransformOutput | null | void;
}

export function createLoader<T = any>(
  options: UserConfig
): (id: string, options?: TransformOptions<T>) => Promise<LoaderFunc>;
