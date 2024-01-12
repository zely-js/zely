const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const TARGETS = [
  ['zely-js', 'main module', true],
  ['zely-js-cli', 'cli'],
  ['zely-js-core', 'core server'],
  ['zely-js-loader', 'javascript/typescript loader'],
  ['zely-js-loader-esbuild', 'esbuild loader'],
  ['zely-js-logger', 'logger'],
  ['zely-js-watch', 'watcher'],
];

function link() {
  TARGETS.forEach(([name, description]) => {
    const file = JSON.parse(
      readFileSync(join(__dirname, `../packages/${name}/package.json`), 'utf8')
    );

    file.description = `${description} for zely-js`;
    file.repository = 'https://github.com/zely-js/zely';
    file.bugs = 'https://github.com/zely-js/zely/issues';
    file.homepage = 'https://zely.vercel.app';

    writeFileSync(
      join(__dirname, `../packages/${name}/package.json`),
      `${JSON.stringify(file, null, 2)}\n`
    );
  });
}

function markdown() {
  TARGETS.forEach(([name, description, make]) => {
    if (make) return;

    const file = JSON.parse(
      readFileSync(join(__dirname, `../packages/${name}/package.json`), 'utf8')
    );
    const md = `# ${file.name}\n
This package is a ${description} for [zely-js](https://github.com/zely-js/zely)\n

\`\`\`bash
npm install zely # or npm install @zely-js/zely
\`\`\`
`;
    writeFileSync(join(__dirname, `../packages/${name}/README.md`), md);
  });
}

if (process.argv.includes('--link')) link();

if (process.argv.includes('--markdown')) markdown();
