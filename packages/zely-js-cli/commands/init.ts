import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ASSETS = {
  javascript: ['package.json', 'zely.config.js', 'pages/index.js'],
  typescript: ['package.json', 'zely.config.ts', 'pages/index.ts'],
};

export function init(directory: string, template: 'javascript' | 'typescript') {
  if (!ASSETS[template]) {
    throw new Error(`Invalid template: ${template}`);
  }

  const assets = ASSETS[template];

  mkdirSync(join(process.cwd(), directory), { recursive: true });
  mkdirSync(join(process.cwd(), directory, 'pages'), { recursive: true });

  for (const asset of assets) {
    copyFileSync(
      join(__dirname, '../assets', template, asset),
      join(process.cwd(), directory, asset)
    );
  }
}
