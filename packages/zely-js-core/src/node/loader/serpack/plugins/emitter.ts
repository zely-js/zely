import { Plugin } from 'serpack';

let mods: string[] = [];

export function emitterPlugin(): Plugin {
  return {
    name: '@zely-js/core/serpack-plugin-module-emitter',
    onSetup() {
      mods = [];
    },

    onResolve(context) {
      if (context.type === 'external') {
        if (mods.includes(context.original.to)) return;

        mods.push(context.original.to);

        const isRuntime = [
          'serpack',
          'zely',
          '@zely-js/zely',
          '@zely-js/core',
          'zely-cli',
          'senta',
        ].includes(context.original.to);

        console.log(
          ` - ${context.original.to.padEnd(20)} ${
            `(in ${context.by || 'unknown'})`.dim
          } ${isRuntime ? '[runtime]'.cyan : ''}`
        );
      }
    },
  };
}
