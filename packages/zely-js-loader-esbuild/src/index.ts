import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { Loader } from '~/zely-js-loader';
import type { UserConfig } from '~/zely-js-core';

import { filenamePlugin } from './filename';

export function esbuildLoader(options: UserConfig): Loader<esbuild.BuildOptions> {
  return {
    name: 'esbuild',

    async transform(id, source, buildoptions) {
      const out = await esbuild.build({
        entryPoints: [id],
        outdir: join(
          options.cwd || process.cwd(),
          options.dist || '.zely',
          buildoptions.type
        ),
        assetNames: '[name].[hash]',
        entryNames: '[name].[hash]',

        bundle: true,
        minify: true,
        sourcemap: true,
        write: false,

        platform: 'node',
        format: __ESM__ ? 'esm' : 'cjs',

        plugins: [nodeExternalsPlugin() as any, filenamePlugin],
      });

      const $ = {
        map: null,
        filename: null,
      };

      for (const output of out.outputFiles) {
        mkdirSync(dirname(output.path), { recursive: true });
        writeFileSync(output.path, output.text);
        if (output.path.endsWith('.map')) {
          $.map = output.path;
        } else {
          $.filename = output.path;
        }
      }

      return $;
    },
  };
}
