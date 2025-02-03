import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import prompts, { PromptObject } from 'prompts';

const ASSETS = {
  javascript: ['package.json', 'zely.config.js', 'pages/index.js'],
  typescript: ['package.json', 'zely.config.ts', 'pages/index.ts'],
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
      message: 'Enable Serpack (experimental)?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    },
  ]);

  directory = response.directory;
  template = response.template;

  const assets = ASSETS[template];

  mkdirSync(join(process.cwd(), directory), { recursive: true });
  mkdirSync(join(process.cwd(), directory, 'pages'), { recursive: true });

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
  }

  console.log('\n Template Cloned!!\n'.cyan);

  console.log('  npm install # yarn'.cyan);
  console.log('  npm dev # yarn dev\n'.cyan);
}
