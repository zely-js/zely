import { staticPlugin } from '@zely-js/static';
import { join } from 'path';
import { defineConfig } from 'zely';

export default defineConfig({
  globalImport: true,
  plugins: [
    staticPlugin('/static', './static', {
      disableCopyDirectory: true,
    }),
  ],
});
