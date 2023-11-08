/* eslint-disable no-continue */
import { BuildOptions, build } from 'esbuild';
import { configDev } from 'zely';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

import { BuilderOptions } from '$zely-builder';
import { readDirectory } from '$zely/lib/readDirectory';

export class Builder {
  options: BuilderOptions;

  constructor(opts?: BuilderOptions) {
    this.options = opts || {};
  }

  // eslint-disable-next-line class-methods-use-this
  writefile(path: string, data: any) {
    mkdirSync(join(path, '../'), { recursive: true });
    writeFileSync(join(path), data);
  }

  async buildFiles(files: string[], out?: string) {
    const typescriptfiles = files.filter(
      (file) => file.endsWith('.ts') || file.endsWith('.js')
    );
    const pluginfiles = files.filter((file) => !typescriptfiles.includes(file));

    rmSync(out || 'dist', { recursive: true, force: true });

    const esbuildOptions: BuildOptions = {
      ...(this.options?.esbuild || {}),

      entryPoints: typescriptfiles,
      outdir: join(out || 'dist', 'pages'),

      minify: true,
      bundle: true,

      platform: 'node',
      format: 'esm',

      chunkNames: '../chunks/[name].[hash]',
    };

    await build(esbuildOptions);

    for (const file of pluginfiles) {
      this.writefile(join(out || 'dist', file), readFileSync(file));
    }
  }

  async buildPages() {
    const pages = this.options.zely?.routes || 'pages';
    const directory = readDirectory(pages);

    await this.buildFiles(directory, this.options.output);
  }

  async process() {
    await this.buildPages();

    const $ = {
      '/package.json': readFileSync(join(__dirname, '../assets/index0.json')),
      '/main.js': readFileSync(join(__dirname, '../assets/index0.js')),
    };

    const out = this.options.output || 'dist';

    writeFileSync(join(out, 'package.json'), $['/package.json']);

    writeFileSync(join(out, 'main.js'), $['/main.js']);

    if (!existsSync(join(out, 'cache'))) {
      mkdirSync(join(out, 'cache'));
    }

    const config = await configDev(out, 'esm');

    writeFileSync(
      join(out, 'config.js'),
      `export * from "./${relative(out, config).replace(/\\/g, '/')}";`
    );
  }
}

export default Builder;
