/* eslint-disable prefer-regex-literals */
import fs from 'node:fs';
import path from 'node:path';

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
          .replace('__dirname', `"${dirname.replace(/\\/g, '\\\\')}"`)
          .replace('__filename', `"${filePath.replace(/\\/g, '\\\\')}"`);
        return {
          contents,
          loader,
        };
      }
    });
  },
};
