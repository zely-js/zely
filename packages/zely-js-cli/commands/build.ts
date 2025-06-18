import { build as coreBuild } from '@zely-js/zely';
import { getConfig } from '../lib/config';

export async function build(bundle = false) {
  const config = await getConfig();
  const { message } = await coreBuild({
    ...config,
    build: {
      bundle,
    },
  });

  console.log(message);
}
