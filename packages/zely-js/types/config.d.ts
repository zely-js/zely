import { UserConfig } from '@zely-js/core';
import { Plugin } from './plugin';

export interface Config extends UserConfig {
  plugins?: Plugin[];
}
