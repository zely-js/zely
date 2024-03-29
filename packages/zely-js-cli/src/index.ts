#!/usr/bin/env node

import animaux from 'animaux';

import { info } from '@zely-js/logger';
import pkg from '../package.json';
import { dev } from '../commands/dev';
import { build } from '../commands/build';
import { init } from '../commands/init';
import { start } from '../commands/start';

const app = animaux('zely-js');

app.version(pkg.version);

app.command('dev').action(async () => {
  // development mode
  process.env.NODE_ENV = 'development';
  process.env.ZELY_WORKING_FRAMEWORK = 'zely-cli';

  await dev();
});

app.command('build').action(async () => {
  // production mode
  process.env.NODE_ENV = 'production';
  process.env.ZELY_WORKING_FRAMEWORK = 'zely-cli';

  await build();
});

app.command('start').action(async () => {
  // production mode
  process.env.NODE_ENV = 'production';
  process.env.ZELY_WORKING_FRAMEWORK = 'zely-cli';

  await start();
});

app
  .command('init')
  .option('--dir, -d', 'Provide output directory.')
  .option('--template, -t', 'Template (typescript/javascript)', 'typescript')
  .action(async (options) => {
    // console.log(options);
    info(`cloning template: ${options.template || 'typescript'}`);
    await init(options.dir || '.', options.template || 'typescript');
  });

app.parse(process.argv);
