#!/usr/bin/env node

import { readFileSync, rmSync, writeFileSync } from 'fs';
import { join, normalize } from 'path';

import { performance } from 'perf_hooks';
import program from 'animaux';

import pkg from '../../package.json';
import { Config, getConfig } from '../config';
import { add } from '../core/add';
import { Watch } from '../core/watch';
import { exportServer } from '../export';
import { error, info, warn } from '../logger';
import { Zely } from '../server/index';
import { showListen } from '../show-listen';
import { CACHE_DIRECTORY } from '../constants';

const app = program('zely');

app.version(pkg.version);

app
  .command('dev')
  .describe('Start Server (development mode)')
  .option('--config, -c', 'Provide config file path.')
  .action(async (options) => {
    rmSync(CACHE_DIRECTORY, { recursive: true, force: true });

    const config: Config = {
      ...(await getConfig(options.config || null)),
      server: { keepCache: true },
    };
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
  .option('--module, -m', 'Export server instead of starting server.', false)
  .option('--output, -o', 'Provide output file.')
  .action(async (options) => {
    const config = await getConfig(options.config || null);

    if (options.bundle) {
      console.log();
      info('--bundle option enabled.\n');
    }

    await exportServer(config, options.output, options.bundle, options.module);

    process.exit(0);
  });

app
  .command('analyze')
  .describe('Analyze Application')
  .action(async () => {
    const analyzer = await import('$zely/analyzer');

    analyzer.core();
  });

app
  .command('add')
  .describe('Add Plugin')
  .option('--engine, -e', 'which package manager you want to use. (npm, yarn)')
  .action(async (command, options) => {
    try {
      if (typeof command === 'string') {
        add(command, options.engine);
      } else {
        error('args must be provided');
      }
    } catch (e) {
      error(e);
    }
  });

app
  .command('preview')
  .describe('generate Preview Server')
  .option('--output, -o', 'Provide output file')
  .action(async (options) => {
    try {
      let outfile = 'zely.preview.js';

      if (options.output) {
        outfile = options.output;
      }

      const file = readFileSync(join(__dirname, '../assets/preview.js'));
      writeFileSync(outfile, file);

      console.log();
      console.log('Preview executable file has been created.'.green);
      console.log();
      console.log('Please enter the command below'.gray);
      console.log(`${'$'.gray} node ${normalize(outfile).bold}`);
      console.log();
    } catch (e) {
      error(e);
    }
  });

app.parse(process.argv);
