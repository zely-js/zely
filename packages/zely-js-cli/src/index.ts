#!/usr/bin/env node

import animaux from 'animaux';

import pkg from '../package.json';
import { dev } from '../commands/dev';
import { build } from '../commands/build';

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

app.parse(process.argv);
