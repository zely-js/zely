import { BuildOptions } from 'esbuild';

export interface DeployPreset {
  imports: string[];
  scripts: string[];
  exports: {
    handler: string;
    custom?: string[];
  };

  build?: BuildOptions;
}
