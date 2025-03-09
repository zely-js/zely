import { mkdirSync, writeFileSync } from 'fs';
import { relative, join, dirname } from 'path';
import { compile, CompilerOptions, loadConfig } from 'serpack';
import { removeExtension } from '~/zely-js-core/lib/ext';
import { Loader, UserConfig } from '~/zely-js-core/types';

export function serpackLoader(options: UserConfig): Loader<CompilerOptions> {
  let serpackConfig: CompilerOptions;

  return {
    name: '@zely-js/core:serpack-loader',

    async transform(id, source, buildoptions) {
      if (!id.endsWith('.ts') && !id.endsWith('.js')) {
        return;
      }

      if (!serpackConfig) {
        serpackConfig =
          (await loadConfig(options.cwd || process.cwd()))?.compilerOptions || {};
      }

      let outfile = `index${Math.floor(Math.random() * 1000)}.js`;

      if (buildoptions.type === 'page') {
        outfile = relative(
          join(options.cwd || process.cwd(), 'pages'),
          `${removeExtension(id)}${Math.floor(Math.random() * 1000)}`
        );
      }

      const outpath = `${join(
        options.cwd || process.cwd(),
        options.dist || '.zely',
        buildoptions.type,
        outfile
      )}.js`;

      const compilerConfig: CompilerOptions = {
        nodeExternal: true,
        runtime: true,
        sourcemap: true,
        sourcemapOptions: {
          sourcemapRoot: dirname(outpath),
        },
        type: 'script',
        ...serpackConfig,
        ...buildoptions.buildOptions,
      };

      if (!compilerConfig.footer) {
        compilerConfig.footer = '';
      }

      compilerConfig.footer = `Object.defineProperty(module.exports, "__serpack_module__", {value:true, enumerable: false});${compilerConfig.banner}`;

      const output = await compile(id, compilerConfig);

      mkdirSync(dirname(outpath), { recursive: true });

      writeFileSync(outpath, output.code);
      writeFileSync(`${outpath}.map`, output.map || '{}');

      return { filename: outpath, map: `${outpath}.map` };
    },
  };
}
