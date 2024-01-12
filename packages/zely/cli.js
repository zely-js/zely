#!/usr/bin/env node

// cli for zely@3

// if you want to use zely@2 cli, you need to install zely@2.
// npm install zely@2

try {
  require('zely-cli');
} catch (e) {
  await import('zely-cli');
}
