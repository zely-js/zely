import { zely } from '@zely-js/zely';
import { error, info } from '@zely-js/logger';
import { getConfig } from '../lib/config';

export async function dev() {
  let port = 8080;
  const startTime = performance.now();
  try {
    const config = await getConfig(process.env.SERPACK === 'true');

    if (process.env.SERPACK === 'true') {
      if (!config.experimental) config.experimental = {};
      config.experimental.useSerpack = true;
    }

    port = config?.server?.port || port;

    const server = await zely(config);

    server.server.listen(port, () => {
      console.log();
      info(
        'Server is running on '.white +
          `http://localhost:${port}`.cyan.underline.bold +
          '.'.white +
          ` (Ready in ${(performance.now() - startTime).toFixed(1)}ms)\n`.dim
      );
    });
  } catch (e) {
    // if port already in use
    if (e.code === 'EADDRINUSE') {
      error(`Port ${port} is already in use.`);
      process.exit(1);
    }
    error(e);
  }
}
