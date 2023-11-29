/* eslint-disable import/named */
/* eslint-disable no-continue */
import { BuildOptions, build } from 'esbuild';
import { CACHE_DIRECTORY, configDev, createStatic, getConfig, getPages } from 'zely';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, parse, relative } from 'path';

import { BuilderOptions } from '$zely-builder';
import { readDirectory } from '$zely/lib/readDirectory';
import { transformFilename } from '$zely/lib/transform-filename';
import { prettyURL } from '$zely/lib/pretty-url';

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
    const loadmap: { path: string; module: string; type: string }[] = [];

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

      metafile: true,
    };

    const generatePath = (file: string, keepExt: boolean = false) => {
      // eslint-disable-next-line prefer-const
      let { name, dir, ext } = parse(
        relative(this.options.zely?.routes || 'pages', file)
      );

      const original = join(
        this.options.zely?.routes || 'pages',
        dir,
        `${name}${keepExt ? ext : '.js'}`
      );

      if (name === 'index') {
        name = '';
      }

      file = join(dir, name);
      file = file.replace(/\\/g, '/');
      file = transformFilename(file, this.options?.zely?.useBrackets);
      file = prettyURL(file);

      return { file, original };
    };

    for (const file of typescriptfiles) {
      const { file: filename, original } = generatePath(file);
      loadmap.push({ path: filename, module: original, type: 'module' });
    }

    for (const file of pluginfiles) {
      const { file: filename, original } = generatePath(file, true);
      loadmap.push({ path: filename, module: original, type: 'html' });
    }

    await build(esbuildOptions);

    for (const file of pluginfiles) {
      this.writefile(join(out || 'dist', file), readFileSync(file));
    }

    this.writefile(
      join(out || 'dist', 'routes.js'),
      `import{readFileSync}from"fs";export default[${loadmap
        .map(
          ({ path, module, type }) =>
            `{type:"${type}",file:${JSON.stringify(path)},m:${
              type === 'html'
                ? `readFileSync(${JSON.stringify(
                    `./${relative(out || 'dist', join(out || 'dist', module)).replace(
                      /\\/g,
                      '/'
                    )}`
                  )},"utf-8")`
                : `await import(${JSON.stringify(
                    `./${relative(out || 'dist', join(out || 'dist', module)).replace(
                      /\\/g,
                      '/'
                    )}`
                  )})`
            }}`
        )
        .join(',\n')}];`
    );
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
    const userConfig = await getConfig();

    await getPages(userConfig);

    writeFileSync(join(out, 'static'), readFileSync(join(CACHE_DIRECTORY, 'static')));

    writeFileSync(
      join(out, 'config.js'),
      `import config from"./${relative(out, config).replace(
        /\\/g,
        '/'
      )}";export{config as default};`
    );
  }
}

export default Builder;
