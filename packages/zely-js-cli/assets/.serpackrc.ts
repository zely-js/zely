import { join } from 'node:path';

export default <import('serpack').Options>{
  compilerOptions: {
    // Resolver options for specifying tsconfig.json
    resolverOptions: {
      tsconfig: {
        configFile: join(process.cwd(), 'tsconfig.json'),
      },
    },
  },
};
