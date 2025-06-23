import { UserConfig } from '@zely-js/core';
import { Server } from '.';

export interface Plugin {
  name: string;

  config?(config: UserConfig): Promise<UserConfig | null> | UserConfig | null;

  whenServerStart?(): Promise<void> | void;

  server?(server: Server): Promise<void> | void;

  whenBuild?(outdir: string): Promise<void> | void;
  afterBuild?(outdir: string): Promise<void> | void;
}
