import { Request, Response } from 'osik';
import { Config, ZelyRequest, ZelyResponse, pureMiddleware } from '.';

/*

Javascript API

*/

export type FileType = 'html' | 'module';

export type FileData = {
  file: string;
  m:
    | {
        [key: string]: (req: ZelyRequest, res: ZelyResponse) => void | Promise<void>;
      }
    | string;
  type: FileType;
  modulePath: string;
  origin?: string;
};

export function getPages(config: Config): Promise<FileData[]>;

export function filenameToRoute(map: FileData[]): FileData[];

export function Handler(req: Request, res: Response, config: Config): Promise<void>;

export function handles(
  req: Request,
  res: Response,
  routes: FileData[],
  config: Config
): void;

/**
 * load typescript file
 * @param target
 */
export function typescriptLoader(target: string): Promise<{ filename: string; m: any }>;

export interface Page {
  before?(req: ZelyRequest, res: ZelyResponse): void | Promise<void>;
  after?(req: ZelyRequest, res: ZelyResponse): void | Promise<void>;
  path?: string;
}

export function middleware(config: Config): Promise<pureMiddleware[]>;
