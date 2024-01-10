// @ts-nocheck

import { Loader } from '@zely-js/loader';
import { UserConfig } from '@zely-js/core';

import esbuild from 'esbuild';

export function esbuildLoader(options: UserConfig): Loader<esbuild.BuildOptions>;
