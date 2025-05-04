import { join } from 'node:path';
import { optimizer } from '@zely-js/optimizer';

export default <import('serpack').Options>{
  compilerOptions: {
    // You can store server data automatically using @zely-js/optimizer plugin.
    // See more - https://zely.vercel.app/docs/server-data
    plugins: [optimizer()],

    // Resolver options for specifying tsconfig.json
    resolverOptions: {
      tsconfig: {
        configFile: join(process.cwd(), 'tsconfig.json'),
      },
    },
  },
};
