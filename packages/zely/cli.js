#!/usr/bin/env node

// support esm (cli)

try {
  require('./dist/bin.js');
} catch (e) {
  import('./dist/bin.mjs');
}
