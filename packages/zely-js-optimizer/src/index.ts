import type { CompilerOptions, Plugin } from 'serpack';

export interface OptimizerOptions {}

function getCallerName(node: any): string | null {
  if (!node) return null;

  if (node.type === 'Identifier') {
    return node.name;
  }

  if (node.type === 'MemberExpression') {
    return getCallerName(node.property);
  }

  return null;
}

export function optimizer(options?: OptimizerOptions): Plugin {
  return {
    name: '@zely-js/optimizer',
    onSetup(compilerOptions) {
      if (compilerOptions.modifier?.caller) {
        throw new Error(
          'A crash occurred while applying the optimization plugin. Please remove @zely-js/optimizer or resolve other conflict factors (serpackOptions.modifier.caller).'
        );
      } else {
        compilerOptions.modifier = {};
      }

      compilerOptions.swcOptions = {
        jsc: {
          minify: {
            compress: false,
            keep_fnames: true,
          },
        },
      };

      compilerOptions.banner = `${
        compilerOptions.banner || ''
      };var {$serpack_cache}=require("@zely-js/optimizer");`;

      compilerOptions.modifier.caller = (node) => {
        const name = getCallerName(node.callee);

        if (!name?.startsWith('$')) return node;

        const wrapCallExpression = {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: '$serpack_cache' },
          arguments: [
            node,
            {
              type: 'MemberExpression',
              object: {
                type: 'ThisExpression',
              },
              property: {
                type: 'Identifier',
                name: 'context',
              },
              computed: false,
              optional: false,
            },
            {
              type: 'Literal',
              value: name,
              raw: `'${name}'`,
            },
          ],
        };

        return wrapCallExpression as any;
      };
    },
  };
}

export * from './cache';
