#!/usr/bin/env node

import program from 'animaux';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { performance } from 'perf_hooks';

import pkg from '../../package.json';
import { getConfig } from '../config';
import { add } from '../core/add';
import { Watch } from '../core/watch';
import { exportServer } from '../export';
import { error, info, warn } from '../logger';
import { Zely } from '../server/index';
import { showListen } from '../show-listen';

const app = program('zely');

app.version(pkg.version);

app
  .command('dev')
  .describe('Start Server (development mode)')
  .option('--config, -c', 'Provide config file path.')
  .action(async (options) => {
    const config = await getConfig(options.config || null);
    const port = config.port || 5050;
    const startTime = performance.now();

    try {
      (await Zely(config)).listen(port, () => {
        showListen(port);

        if (config?.watch?.enable === true || !config?.watch) {
          Watch(config);
          info('Observer is watching your app.');
        } else {
          warn('Observer has been disabled.');
        }

        info(`Done in ${(performance.now() - startTime).toFixed()}ms`);
      });
    } catch (e) {
      error(e);
    }
  });

app
  .command('export', ['build'])
  .describe('Export Zely Server')
  .option('--bundle, -b', 'Bundle with node_modules', true)
  .action(async (options) => {
    const config = await getConfig(options.config || null);

    if (options.bundle) {
      console.log();
      info('--bundle option enabled.\n');
    }

    exportServer(config, options.bundle);
  });

app
  .command('analyze')
  .describe('Analyze Application')
  .action(async () => {
    try {
      const { core } = require('prext-analyst');
      core();
    } catch (e) {
      error(
        `Cannot find module "prext-analyst"\n\nRun:\n${
          '$'.grey
        } npm i --save-dev prext-analyst\n`
      );
    }
  });

app
  .command('add')
  .describe('Add Plugin')
  .action(async (command) => {
    try {
      add(command);
    } catch (e) {
      error(e);
    }
  });

app
  .command('preview')
  .describe('generate Preview Server')
  .action(async () => {
    try {
      const file = readFileSync(join(__dirname, '../assets/preview.js'));
      writeFileSync('zely.preview.js', file);

      console.log();
      console.log('Preview executable file has been created.'.green);
      console.log();
      console.log('Please enter the command below'.gray);
      console.log(`${'$'.gray} node ./zely.preview.js`);
      console.log();
    } catch (e) {
      error(e);
    }
  });

app.parse(process.argv);
