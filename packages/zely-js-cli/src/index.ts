#!/usr/bin/env node

import animaux from 'animaux';

import pkg from '../package.json';
import { dev } from '../commands/dev';
import { build } from '../commands/build';
import { init } from '../commands/init';

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

app
  .command('init')
  .option('--dir, -d', 'Provide output directory.')
  .option('--template, -t', 'Template (typescript/javascript)', 'typescript')
  .action(async (options) => {
    // console.log(options);
    await init(options.dir || '.', options.template || 'typescript');
  });

app.parse(process.argv);
