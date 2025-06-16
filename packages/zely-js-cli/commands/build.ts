import { build as coreBuild } from '@zely-js/zely';
import { getConfig } from '../lib/config';

export async function build(bundle = true) {
  const config = await getConfig();
  await coreBuild({
    ...config,
    build: {
      bundle,
    },
  });
}
