const tsconfig = require('./tsconfig');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
  testMatch: ['packages/**/tests/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  modulePaths: [tsconfig.compilerOptions.baseUrl],
  moduleNameMapper,
};
