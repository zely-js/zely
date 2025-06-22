import { staticPlugin } from '@zely-js/static';
import { defineConfig } from 'zely';

export default defineConfig({
  globalImport: true,
  plugins: [staticPlugin('/static', './static')],
});
