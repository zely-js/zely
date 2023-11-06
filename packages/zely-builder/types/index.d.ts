import type { BuildOptions } from 'esbuild';
import type { Config } from 'zely';

export interface BuilderOptions {
  esbuild?: BuildOptions;
  zely?: Config;
  output?: string;
}

export class Builder {
  constructor(opts?: BuilderOptions);

  buildPages(): Promise<void>;
  buildFiles(): Promise<void>;

  /**
   * build zely application
   */
  process(): Promise<void>;
}
