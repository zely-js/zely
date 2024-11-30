import { mkdirSync, writeFileSync } from 'fs';
import { join, parse } from 'path';
import { Loader } from '~/zely-js/types';
import { useEnhancedHTML } from './enhanced';

const HTMLloader = (options: any): Loader => ({
  name: '@zely-js/core:html',
  async transform(id) {
    if (!id.endsWith('.html')) return;
    const { template: output, built } = await useEnhancedHTML(id, options);

    const dist = join(
      options.cwd || process.cwd(),
      options.dist || '.zely',
      'fe',
      'generated'
    );
    const filename = parse(id).name;
    const outfile = join(
      dist,
      `${filename}.${(Math.random() + 1).toString(36).substring(7)}.js`
    );
    mkdirSync(dist, { recursive: true });

    const code = `[core.GET((c) => c.html(\`${output.replace(
      /\\/g,
      '\\\\'
    )}\`.replace("%props%", JSON.stringify({params: c.params}))))];`;

    if (__ESM__) {
      writeFileSync(
        outfile,
        `import * as core from "@zely-js/core";export default ${code}`
      );
    } else {
      writeFileSync(
        outfile,
        `const core=require("@zely-js/core");module.exports = ${code}`
      );
    }

    return { filename: outfile, map: null, assets: Object.values(built) };
  },
});

export { HTMLloader };
