import { staticPlugin } from '@zely-js/static';
import { defineConfig } from 'zely';

export default defineConfig({
  plugins: [staticPlugin('/static', './static')],
});
