import { OutputFile } from 'esbuild';
import { UserConfig } from '../config';

export interface FeComponent {
  children: string;
  attributes: Record<string, string | boolean>;
}

export type FeScripts = Array<{
  target: string;
  type: 'link' | 'insert';
  module: boolean;
  attributes: Record<string, string | boolean>;
}>;

export interface FePageData {
  head: Record<string, FeComponent>;
  body: Record<string, FeComponent>;
  /**
   * ```ts
   * [
   *   { target: "./src/index.ts", type: "insert" }
   *   // target: filename to compile and send to browser
   *   // type: - link: <script src="~">
   *   //       - insert: <script>~</script>
   * ]
   * ```
   */
  scripts: FeScripts;
}

export function compileBrowserCode(
  scripts: FeScripts,
  options: UserConfig
): Promise<{
  outputFiles: OutputFile[];
  out: Record<string, string>;
}>;

export interface FrontendPageOutput {
  template: string;
  $: {
    head: string;
    body: string;
    script: any[];
  };
}

export function createFrontendPage(
  page: FePageData,
  template?: string,
  options?: UserConfig,
  plugins?: any[]
): Promise<FrontendPageOutput>;
