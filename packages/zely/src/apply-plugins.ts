import type { Server } from 'zept';
import { kit } from './plugins/kit';
import { Static } from './plugins/public';
import type { Config } from './config';

export function applyPlugins(app: Server, config: Config) {
  // @zely/plugin-kit

  kit().server(app);

  if (config.public) app.use(Static(config.public, config.publicOptions));

  // user plugins

  config.plugins?.forEach((plugin) => {
    // console.log(plugin);
    if (plugin.server) plugin.server(app);
  });
}
