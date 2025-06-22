import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import prompts, { PromptObject } from 'prompts';
import { warn } from '@zely-js/logger';

const ASSETS = {
  javascript: ['package.json', 'zely.config.js', 'pages/index.js'],
  typescript: [
    'package.json',
    'zely.config.ts',
    'pages/index.ts',
    'tsconfig.json',
    'env.d.ts',
    'static/static.txt',
  ],
};

const ASSETS_SERPACK = {
  javascript: ['pages/[name].js'],
  typescript: ['pages/[name].ts'],
};

export async function init(directory?: string, template?: 'javascript' | 'typescript') {
  const questions: PromptObject<string>[] = [];

  if (!directory) {
    questions.push({
      type: 'text',
      name: 'directory',
      message: 'App Directory',
    });
  }

  if (!template) {
    questions.push({
      type: 'select',
      name: 'template',
      message: 'App Template',
      choices: [
        { title: 'TypeScript'.blue, value: 'typescript' },
        {
          title: 'JavaScript'.yellow,
          value: 'javascript',
        },
      ],
    });
  }

  const response = await prompts([
    ...questions,
    {
      type: 'toggle',
      name: 'serpack',
      message: 'Enable Serpack (recommended)?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    },
  ]);

  directory = response.directory;
  template = response.template;

  const assets = ASSETS[template];

  mkdirSync(join(process.cwd(), directory), { recursive: true });
  mkdirSync(join(process.cwd(), directory, 'pages'), { recursive: true });
  mkdirSync(join(process.cwd(), directory, 'static'), { recursive: true });

  for (const asset of assets) {
    copyFileSync(
      join(__dirname, '../assets', template, asset),
      join(process.cwd(), directory, asset)
    );
  }

  if (response.serpack) {
    const pkgjson = JSON.parse(
      readFileSync(join(process.cwd(), directory, 'package.json')).toString()
    );

    const configFile = `.serpackrc.${template === 'typescript' ? 'ts' : 'js'}`;

    pkgjson.scripts.dev = 'zely dev --serpack';
    writeFileSync(
      join(process.cwd(), directory, configFile),
      readFileSync(join(__dirname, '../assets', configFile))
    );
    writeFileSync(
      join(process.cwd(), directory, 'package.json'),
      JSON.stringify(pkgjson, null, 2)
    );

    for (const asset of ASSETS_SERPACK[template]) {
      copyFileSync(
        join(__dirname, '../assets', template, asset),
        join(process.cwd(), directory, asset)
      );
    }
    console.log();

    warn(
      // eslint-disable-next-line no-multi-str
      'serpack is enabled. This compiler is an experimental feature. \
      \nIf you experience compiler errors, you can workaround it by removing the `--serpack` flag.\
      \nDocumentation - https://zely.vercel.app/serpack'
    );
  }

  console.log('\n Template Cloned!!\n'.cyan);

  console.log('  npm install # yarn'.cyan);
  console.log('  npm dev # yarn dev\n'.cyan);
}
