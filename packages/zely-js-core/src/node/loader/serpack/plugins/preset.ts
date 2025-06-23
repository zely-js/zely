import { Plugin } from 'serpack';

export function serpackPlugin(): Plugin {
  return {
    name: '@zely-js/core/serpack-plugin',
    onSetup(compilerOptions) {
      if (!compilerOptions.footer) {
        compilerOptions.footer = '';
      }
      if (!compilerOptions.banner) {
        compilerOptions.banner = '';
      }

      compilerOptions.banner = `var {GET,ALL,POST,DELETE,PUT}=require("@zely-js/core");${
        compilerOptions.banner || ''
      }`;

      compilerOptions.footer = `Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !1});${
        compilerOptions.footer || ''
      }`;
    },
  };
}
