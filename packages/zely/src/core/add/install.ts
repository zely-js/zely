import { existsSync } from 'node:fs';

import { spawn } from 'child_process';

export function installEngine() {
  if (existsSync('yarn.lock')) {
    return 'yarn';
  }
  return 'npm';
}

export function installDependencies(
  // eslint-disable-next-line default-param-last
  devDependencies: string[] = [],
  engineRequested?: 'yarn' | 'npm'
): Promise<void> {
  const engine = engineRequested || installEngine();
  return new Promise((resolve) => {
    if (engine === 'yarn') {
      const pro = spawn(
        `${/^win/.test(process.platform) ? 'yarn.cmd' : 'yarn'}`,
        ['add', '-D', ...devDependencies],
        { cwd: process.cwd() }
      );
      pro.on('exit', () => {
        resolve();
      });
    } else {
      const pro = spawn(
        `${/^win/.test(process.platform) ? 'npm.cmd' : 'npm'}`,
        ['i', '--save-dev', ...devDependencies],
        { cwd: process.cwd() }
      );

      pro.on('exit', () => {
        resolve();
      });
    }
  });
}
