/* eslint-disable prefer-regex-literals */

// https://github.com/evanw/esbuild/issues/859#issuecomment-829154955

import fs from 'fs';
import path from 'path';

const nodeModules = new RegExp(/^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/);

export const filenamePlugin = {
  name: 'dirname',

  setup(build) {
    build.onLoad({ filter: /.*/ }, ({ path: filePath }) => {
      if (!filePath.match(nodeModules)) {
        let contents = fs.readFileSync(filePath, 'utf8');
        const loader = path.extname(filePath).substring(1);
        const dirname = path.dirname(filePath);
        contents = contents
          .replace('__dirname', `"${dirname}"`)
          .replace('__filename', `"${filePath}"`);
        return {
          contents,
          loader,
        };
      }
    });
  },
};
