import { zely } from '@zely-js/zely';
import { watch } from '@zely-js/watch';
import { error, info } from '@zely-js/logger';
import { getConfig } from '../lib/config';

export async function dev() {
  let port = 8080;
  try {
    const config = await getConfig();

    port = config?.server?.port || port;

    const server = await zely(config);

    watch({}, config);

    server.listen(port, () => {
      info(`Server is running on http://localhost:${port}`);
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
