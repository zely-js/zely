import { optimizer } from '@zely-js/optimizer';

export default <import('serpack').Options>{
  compilerOptions: {
    plugins: [optimizer()],
    forceExternal: ['@zely-js/core', 'zely', '@zely-js/zely', 'zely', '@zely-js/zely'],
  },
};
