import { Plugin } from 'serpack';

export function serpackPlugin(): Plugin {
  return {
    name: '@zely-js/core/serpack-plugin',
    onSetup(compilerOptions) {
      if (!compilerOptions.footer) {
        compilerOptions.footer = '';
      }

      compilerOptions.footer = `Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !!0});${
        compilerOptions.footer || ''
      }`;
    },
  };
}
