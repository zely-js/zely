import { relative } from 'path';
import type { Plugin } from 'serpack';
import type { Plugin as ZelyPlugin } from '~/zely';

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

export function storePlugin(): Plugin {
  return {
    name: '@zely-js/core:store',

    onSetup(compilerOptions) {
      if (compilerOptions.modifier?.caller) {
        throw new Error(
          'A crash occurred while applying the optimization plugin. Please remove @zely-js/optimizer or resolve other conflict factors (serpackOptions.modifier.caller).'
        );
      } else {
        compilerOptions.modifier = {};
      }

      compilerOptions.banner = `${
        compilerOptions.banner || ''
      };/*store_helpers*/var {$store,$access,$cache}=require("@zely-js/core");`;

      compilerOptions.modifier.caller = (node, parent, ctx) => {
        const name = getCallerName(node.callee);

        if (name !== '$store') return node;

        if (node.arguments.length === 0) {
          node.arguments.push({
            type: 'Literal',
            value: null,
            raw: 'null',
          } as any);
        }

        if (node.arguments.length === 1) {
          node.arguments.push({
            type: 'ArrayExpression',
            elements: [],
          } as any);
        }

        const key = `${relative(process.cwd(), ctx.filename)}-${node.start}`;

        node.arguments.push({
          type: 'Literal',
          value: key,
          raw: `"${key}"`,
          leadingComments: [
            {
              type: 'Block',
              value: key,
            },
          ],
        } as any);

        return node as any;
      };
    },
  };
}

export function zelyStorePlugin(): ZelyPlugin {
  return {
    name: '@zely-js/core:store-plugin',
    config(config) {
      if (!config.experimental?.useSerpack && !process.argv.includes('--serpack')) {
        throw new Error(
          'To use $store, you have to enable serpack compiler. - See https://zely.vercel.app/serpack/introduction#getting-started'
        );
      }
      config.experimental ??= {};
      config.experimental.serpackOptions ??= {};
      config.experimental.serpackOptions.plugins ??= [];
      config.experimental.serpackOptions.plugins.push(storePlugin());

      return config;
    },
  };
}
