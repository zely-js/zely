/* eslint-disable no-multi-str */
/* eslint-disable no-await-in-loop */
import { writeFileSync, existsSync, readFileSync, mkdirSync, rmSync } from 'fs';
import { join, relative } from 'path';
import { CompilerOptions } from 'serpack';
import { info as loggerInfo, warn } from '@zely-js/logger';
import { UserConfig } from '~/zely-js-core';
import { createLoader } from '~/zely-js-core/src';
import { readDirectory } from '~/zely-js-core/lib/read-directory';
import { removeExtension } from '~/zely-js-core/lib/ext';
import { middlewareFilenames } from '../../server/middlewares';

const CONFIG_FILE = ['zely.config.ts', 'zely.config.js', 'zely.config.json'];
const buildOptions: CompilerOptions = {
  nodeExternal: true,
  type: 'module',
};

export function getConfig(): string {
  for (const file of CONFIG_FILE) {
    if (file.endsWith('.json')) {
      if (existsSync(file)) return file;
      return;
    }

    if (existsSync(file)) return file;
  }
  return null;
}

export async function buildDev(config: UserConfig, silent: boolean = false) {
  if (config.build?.dist) config.dist = config.build.dist;
  else config.dist = './build';

  process.env.NODE_ENV = 'production';

  const outputDirectory = join(config.cwd || process.cwd(), config.dist);
  const pagesDirectory = join(config.cwd || process.cwd(), 'pages');
  const outFiles = {
    server: join(outputDirectory, 'server.js'),
    config: join(outputDirectory, '_config.js'),
    pages: join(outputDirectory, '_pages.js'),
    middlewares: join(outputDirectory, '_middlewares.js'),
  };
  const configPath = getConfig();
  const startTime = performance.now();
  const isBundleMode = config.build?.bundle;

  const info = (msg: string) => {
    if (!silent) loggerInfo(msg);
  };

  const rm = (directory: string, options: { recursive?: boolean }) => {
    if (existsSync(directory)) rmSync(directory, options);
  };

  rm(outputDirectory, { recursive: true });
  mkdirSync(outputDirectory, { recursive: true });

  const loader = createLoader(config, null, true, true);

  // build pages

  const files = existsSync(pagesDirectory) ? readDirectory(pagesDirectory) : [];
  const pageCode = [];

  const $ = {};

  info('Compiling pages...');

  pageCode.push('var __exports__=(m)=>m.default||m;');
  pageCode.push('var __zely__=require("@zely-js/zely");');
  pageCode.push('module.exports=[');

  for await (const page of files) {
    const compiledPage = await loader(page, { buildOptions, type: 'page' });

    const relativePath = relative(pagesDirectory, page);
    const relativeOutputPath = relative(outputDirectory, compiledPage.filename);

    $[relativePath] = relativeOutputPath;

    pageCode.push(
      `/*  */__zely__.createVirtualPage("${removeExtension(relativePath).replace(
        /\\/g,
        '/'
      )}", __exports__(require("./${relativeOutputPath.replace(/\\/g, '/')}"))),`
    );
  }

  pageCode.push(']');

  writeFileSync(outFiles.pages, pageCode.join('\n'));

  // compile middlewares

  info('Compiling middlewares...');

  const middlewaresFiles = await middlewareFilenames(config, buildOptions);
  const middlewarePageCode = [];

  middlewarePageCode.push('var __exports__=(m)=>m.default||m;');
  middlewarePageCode.push('module.exports=[');

  for (const middlewareFile of middlewaresFiles) {
    const relativeOutputPath = relative(outputDirectory, middlewareFile);
    middlewarePageCode.push(
      `/*  */__exports__(require("./${relativeOutputPath.replace(/\\/g, '/')}")),`
    );
  }

  middlewarePageCode.push(']');

  writeFileSync(outFiles.middlewares, middlewarePageCode.join('\n'));

  // compile server, config

  info('Compiling server...');

  // 1. config
  const compiledConfig = await loader(configPath, { buildOptions, type: 'cache' });
  writeFileSync(outFiles.config, readFileSync(compiledConfig.filename));
  // 2. server
  writeFileSync(
    outFiles.server,
    // eslint-disable-next-line no-template-curly-in-string
    'var __exports__=(m)=>m.default||m;process.env.NODE_ENV="production";var __opt__=__exports__(require("./_config.js"));var __pages__=require("./_pages.js");var __middlewares__=require("./_middlewares.js");\
    if(!__opt__.__virtuals__){__opt__.__virtuals__=[]};if(!__opt__.middlewares){__opt__.middlewares=[]};\
    __opt__.__virtuals__.push(...(__pages__.default || __pages__));\
    __opt__.middlewares.push(...(__middlewares__.default || __middlewares__));\
    __opt__.cwd=__dirname;require("@zely-js/zely").zely(__opt__).then((server) => {server.server.listen(__opt__.port || 8080);console.log(`server is running on http://localhost:${__opt__.port || 8080}`);})'
  );

  mkdirSync(join(outputDirectory, './.zely'));

  if (isBundleMode) {
    const compiledServer = await loader(outFiles.server, { buildOptions, type: 'cache' });
    writeFileSync(outFiles.server, readFileSync(compiledServer.filename));

    // remove unused pages
    rm(join(outputDirectory, 'fe'), { recursive: true });
    rm(join(outputDirectory, 'page'), { recursive: true });
    rm(join(outputDirectory, 'middlewares'), { recursive: true });
    rm(outFiles.config, { recursive: true });
    rm(outFiles.pages, { recursive: true });
    rm(outFiles.middlewares, { recursive: true });
  }

  // remove cache directory
  rm(join(outputDirectory, 'cache'), { recursive: true });

  console.log();
  info(`Done in ${((performance.now() - startTime) / 1000).toFixed(2)}s`);

  return {
    message: `\n${'$ |'.gray} ${'node'.yellow} ${outFiles.server}\n`,
    filename: outFiles.server,
  };
}
