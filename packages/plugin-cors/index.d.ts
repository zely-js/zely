import { Plugin } from 'zely';
import { CorsOptions } from 'cors';

export function clone(template: 'js' | 'ts', outfile: string): void;
export function cors(options?: CorsOptions): Plugin;
