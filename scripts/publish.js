#!/usr/bin/env node

require('colors');

const { spawn } = require('child_process');
const { join } = require('path');

const target = process.argv[2];
const mode = process.argv[3] || 'latest'; // beta / latest

console.log(`Publishing ${target.cyan} ${`(${mode})`.gray}`);

// https://stackoverflow.com/questions/43230346/error-spawn-npm-enoent
const pub = spawn(
  `${/^win/.test(process.platform) ? 'npm.cmd' : 'npm'}`,
  ['publish', `--tag=${mode}`],
  {
    cwd: join(process.cwd(), './packages', target),
  }
);

pub.stderr.on('data', (e) => {
  console.log(e.toString());
});
pub.stdout.on('data', () => {});
