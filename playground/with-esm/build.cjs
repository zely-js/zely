const builder = require('@zely/builder');

const build = new builder.Builder({
  esbuild: {}, // esbuild options
  zely: {}, // zely options
  output: 'dist', // output directory
});

build.process(); // build app
