import { UserConfig } from '@zely-js/core';
import { Server } from '.';

export interface Plugin {
  name: string;

  config?(config: UserConfig): Promise<UserConfig | null>;

  whenServerStart?(): Promise<void>;

  server?(server: Server): Promise<void>;
}
