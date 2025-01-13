import { mkdirSync, writeFileSync } from 'fs';
import { relative, join, dirname } from 'path';
import { compile, CompilerOptions } from 'serpack';
import { removeExtension } from '~/zely-js-core/lib/ext';
import { Loader, UserConfig } from '~/zely-js-core/types';

export function serpackLoader(options: UserConfig): Loader<CompilerOptions> {
  return {
    name: '@zely-js/core:serpack-loader',

    async transform(id, source, buildoptions) {
      if (!id.endsWith('.ts') && !id.endsWith('.js')) {
        return;
      }

      let outfile = `index${Math.floor(Math.random() * 1000)}.js`;

      if (buildoptions.type === 'page') {
        outfile = relative(
          join(options.cwd || process.cwd(), 'pages'),
          removeExtension(id)
        );
      }

      const outpath = `${join(
        options.cwd || process.cwd(),
        options.dist || '.zely',
        buildoptions.type,
        outfile
      )}.js`;

      const output = await compile(id, {
        ...buildoptions.buildOptions,
        forceExternal: ['@zely-js/core', '@zely-js/zely', 'zely'],
      });

      mkdirSync(dirname(outpath), { recursive: true });

      writeFileSync(outpath, output.code);

      return { filename: outpath, map: null };
    },
  };
}
