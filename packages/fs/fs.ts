/* eslint-disable class-methods-use-this */
import {
  mkdirSync as nativeMkdir,
  existsSync as nativeExists,
  writeFileSync as nativeWrite,
  readFileSync as nativeRead,
  readdirSync as nativeReadDir,
  unlinkSync as nativeUnlink,
  rmSync as nativeRm,
} from 'fs';
import { join, dirname, resolve } from 'path';

type FileData = {
  content: Buffer;
  ctime: Date;
  mtime: Date;
};

export class MemoryFileSystem {
  // In-memory directory tree
  private root: Map<string, any> = new Map();

  // LRU cache for files. Map preserves insertion order.
  private fileCache: Map<string, FileData> = new Map();

  private maxFiles: number;

  private diskBackupPath: string;

  constructor(maxFiles: number = 5000, diskBackupPath: string = '.zely') {
    this.maxFiles = maxFiles;
    this.diskBackupPath = resolve(process.cwd(), diskBackupPath);
    if (!nativeExists(this.diskBackupPath)) {
      nativeMkdir(this.diskBackupPath, { recursive: true });
    }
  }

  private splitPath(path: string): string[] {
    return path.split('/').filter(Boolean);
  }

  private getDir(path: string, create = false): Map<string, any> | null {
    const parts = this.splitPath(path);
    let dir = this.root;
    for (const part of parts) {
      if (!dir.has(part)) {
        if (!create) return null;
        const newDir = new Map();
        dir.set(part, newDir);
        dir = newDir;
      } else {
        const next = dir.get(part);
        if (!(next instanceof Map)) return null; // Path part conflicts with a file
        dir = next;
      }
    }
    return dir;
  }

  private getBackupFilePath(path: string): string {
    const relativePath = path.startsWith('/') ? path.substring(1) : path;
    return join(this.diskBackupPath, relativePath);
  }

  private ensureDiskDir(path: string) {
    const dir = dirname(path);
    if (!nativeExists(dir)) {
      nativeMkdir(dir, { recursive: true });
    }
  }

  private touch(path: string) {
    const fileData = this.fileCache.get(path);
    if (fileData) {
      // Re-insert to move to end of map (most recently used)
      this.fileCache.delete(path);
      this.fileCache.set(path, fileData);
    }
  }

  private evictLRU() {
    if (this.fileCache.size <= this.maxFiles) {
      return;
    }
    // First entry is the least recently used
    const [lruPath, lruFile] = this.fileCache.entries().next().value;

    // Evict from in-memory tree
    const parts = this.splitPath(lruPath);
    const fileName = parts.pop()!;
    const dir = this.getDir(`/${parts.join('/')}`);
    dir?.delete(fileName);

    // Save to backup disk and delete from cache
    const backupPath = this.getBackupFilePath(lruPath);
    this.ensureDiskDir(backupPath);
    nativeWrite(backupPath, lruFile.content);
    this.fileCache.delete(lruPath);
  }

  private _rmDirRecursive(dirPath: string, dirMap: Map<string, any>) {
    for (const [key, val] of dirMap) {
      const currentPath = `${dirPath}/${key}`.replace('//', '/');
      if (val instanceof Map) {
        this._rmDirRecursive(currentPath, val);
      } else {
        this.fileCache.delete(currentPath);
      }
      dirMap.delete(key);
    }
  }

  writeFileSync(path: string, content: string | Buffer) {
    const parts = this.splitPath(path);
    const fileName = parts.pop()!;
    const dirPath = `/${parts.join('/')}`;
    const dir = this.getDir(dirPath, true);
    if (!dir) throw new Error(`Invalid path: ${path}`);

    const now = new Date();
    const buf = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const fileData: FileData = {
      content: buf,
      ctime: now,
      mtime: now,
    };

    // Update cache and mark as most recent
    if (this.fileCache.has(path)) {
      this.fileCache.delete(path);
    }
    this.fileCache.set(path, fileData);
    dir.set(fileName, fileData);

    this.evictLRU();
  }

  readFileSync(path: string, encoding?: BufferEncoding): string | Buffer {
    const parts = this.splitPath(path);
    const fileName = parts.pop()!;
    const dirPath = `/${parts.join('/')}`;
    const dir = this.getDir(dirPath);
    const file = dir?.get(fileName);

    // 1. Read from memory
    if (file) {
      this.touch(path);
      return encoding ? file.content.toString(encoding) : file.content;
    }

    // 2. Read from real filesystem
    const absolutePath = resolve(path);
    if (nativeExists(absolutePath)) {
      const data = nativeRead(absolutePath);
      this.writeFileSync(path, data); // Load into memory
      return encoding ? data.toString(encoding) : data;
    }

    // 3. Read from backup disk
    const backupPath = this.getBackupFilePath(path);
    if (nativeExists(backupPath)) {
      const data = nativeRead(backupPath);
      nativeUnlink(backupPath); // Remove from backup after loading
      this.writeFileSync(path, data); // Load into memory
      return encoding ? data.toString(encoding) : data;
    }

    throw new Error(`File not found: ${path}`);
  }

  existsSync(path: string): boolean {
    const parts = this.splitPath(path);
    const fileName = parts.pop()!;
    const dir = this.getDir(`/${parts.join('/')}`);
    if (dir?.has(fileName)) return true;

    const absolutePath = resolve(path);
    if (nativeExists(absolutePath)) return true;

    const backupPath = this.getBackupFilePath(path);
    if (nativeExists(backupPath)) return true;

    return false;
  }

  unlinkSync(path: string) {
    // Delete from memory
    const parts = this.splitPath(path);
    const fileName = parts.pop()!;
    const dir = this.getDir(`/${parts.join('/')}`);
    dir?.delete(fileName);
    this.fileCache.delete(path);

    // Delete from backup
    const backupPath = this.getBackupFilePath(path);
    if (nativeExists(backupPath)) {
      nativeUnlink(backupPath);
    }

    // Delete from real filesystem
    const absolutePath = resolve(path);
    if (nativeExists(absolutePath)) {
      nativeUnlink(absolutePath);
    }
  }

  mkdirSync(path: string, options?: { recursive?: boolean }) {
    if (options?.recursive === false) {
      const parent = dirname(path);
      if (!this.getDir(parent)) {
        throw new Error(`Parent directory does not exist: ${parent}`);
      }
    }
    this.getDir(path, true);
  }

  rmSync(path: string, options?: { recursive?: boolean; force?: boolean }) {
    const parts = this.splitPath(path);
    const entryName = parts.pop()!;
    const parentPath = `/${parts.join('/')}`;
    const parentDir = this.getDir(parentPath);

    const target = parentDir?.get(entryName);

    if (target) {
      // Found in memory
      if (target instanceof Map) {
        // It's a directory
        if (target.size > 0 && !options?.recursive) {
          throw new Error(`Directory not empty: ${path}`);
        }
        this._rmDirRecursive(path, target);
        parentDir.delete(entryName);
      } else {
        // It's a file
        parentDir.delete(entryName);
        this.fileCache.delete(path);
      }
    }

    // Also remove from disk locations, ignoring errors if force is true
    try {
      const absolutePath = resolve(path);
      if (nativeExists(absolutePath)) {
        nativeRm(absolutePath, { recursive: true, force: true });
      }
      const backupPath = this.getBackupFilePath(path);
      if (nativeExists(backupPath)) {
        nativeRm(backupPath, { recursive: true, force: true });
      }
    } catch (e) {
      if (!options?.force) throw e;
    }
  }

  readdirSync(path: string): string[] {
    const memDir = this.getDir(path);
    const entries = new Set<string>(memDir ? [...memDir.keys()] : []);

    try {
      const absolutePath = resolve(path);
      if (nativeExists(absolutePath)) {
        nativeReadDir(absolutePath).forEach((e) => entries.add(e));
      }
    } catch {
      // Ignore errors, e.g. if path is not a directory on disk
    }

    try {
      const backupPath = this.getBackupFilePath(path);
      if (nativeExists(backupPath)) {
        nativeReadDir(backupPath).forEach((e) => entries.add(e));
      }
    } catch {
      // Ignore errors
    }

    return Array.from(entries);
  }
}

const fs = new MemoryFileSystem();

export const {
  writeFileSync,
  readFileSync,
  existsSync,
  unlinkSync,
  mkdirSync,
  rmSync,
  readdirSync,
} = process.argv.includes('--use-experimental-fs')
  ? {
      writeFileSync: fs.writeFileSync.bind(fs),
      readFileSync: fs.readFileSync.bind(fs),
      existsSync: fs.existsSync.bind(fs),
      unlinkSync: fs.unlinkSync.bind(fs),
      mkdirSync: fs.mkdirSync.bind(fs),
      rmSync: fs.rmSync.bind(fs),
      readdirSync: fs.readdirSync.bind(fs),
    }
  : {
      writeFileSync: nativeWrite,
      readFileSync: nativeRead,
      existsSync: nativeExists,
      unlinkSync: nativeUnlink,
      mkdirSync: nativeMkdir,
      rmSync: nativeRm,
      readdirSync: nativeReadDir,
    };
