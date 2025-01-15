/* eslint-disable no-await-in-loop */
import type { UserConfig } from '@zely-js/core';
import { createLoader } from '@zely-js/zely';
import { existsSync, readFileSync } from 'node:fs';

const CONFIG_FILE = ['zely.config.ts', 'zely.config.js', 'zely.config.json'];

export async function getConfig(serpack: boolean = false): Promise<UserConfig> {
  const loader = await createLoader({}, null, serpack);

  for (const file of CONFIG_FILE) {
    if (file.endsWith('.json')) {
      if (existsSync(file)) {
        return JSON.parse(readFileSync(file, { encoding: 'utf-8' }));
      }
      return;
    }

    if (existsSync(file)) {
      const config = (await loader(file)).module;
      return config.default || config;
    }
  }
}
