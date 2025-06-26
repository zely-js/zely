#!/usr/bin/env node

// cli for zely@3 ~

// if you want to use zely@2 cli, you need to install zely@2.
// npm install zely@2

async function start() {
  try {
    await import('zely-cli');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('zely-cli');
  }
}

start();
