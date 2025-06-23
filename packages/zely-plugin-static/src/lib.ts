import fs from 'fs';
import path from 'path';

function isDirectory(dir: string): boolean {
  try {
    return fs.lstatSync(dir).isDirectory();
  } catch {
    return false;
  }
}

function read(dir: string, out: string): void {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const srcPath = path.join(dir, entry);
    const destPath = path.join(out, entry);

    if (isDirectory(srcPath)) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      read(srcPath, destPath);
    } else {
      fs.writeFileSync(destPath, fs.readFileSync(srcPath));
    }
  }
}

export function clone(dir: string, out: string): void {
  if (!fs.existsSync(out)) {
    fs.mkdirSync(out);
  }
  read(dir, out);
}
