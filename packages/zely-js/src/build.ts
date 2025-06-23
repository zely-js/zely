import { error } from '@zely-js/logger';
import { join } from 'path';
import { buildDev } from '@zely-js/core';
import { Config } from '../types';

export async function build(options?: Config) {
  const plugins = options?.plugins || [];
  const outputDirectory = join(
    options?.cwd || process.cwd(),
    options?.build?.dist || './build'
  );

  await Promise.all(
    plugins.map(async (plugin) => {
      try {
        if (plugin.whenBuild) {
          await plugin.whenBuild(outputDirectory);
        }
      } catch (e) {
        error(
          `[${plugin.name}] error occured while running plugin: ${e.message}(.whenBuild)`
        );
      }
    })
  );

  const output = await buildDev(options);

  await Promise.all(
    plugins.map(async (plugin) => {
      try {
        if (plugin.afterBuild) {
          await plugin.afterBuild(outputDirectory);
        }
      } catch (e) {
        error(
          `[${plugin.name}] error occured while running plugin: ${e.message}(.afterBuild)`
        );
      }
    })
  );

  return output;
}
