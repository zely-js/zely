import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { includeIgnoreFile } from '@eslint/compat';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default tseslint.config(tseslint.configs.recommended, [
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/*.d.ts',
      '**/*.config.*',
      '**/*/assets',
      '**/.zely',
      '**/build',
      '**/.yarn',
    ],
  },
  includeIgnoreFile(gitignorePath),
  ...compat.extends('airbnb-base'),
  {
    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'import/no-duplicates': 'off',
      'no-empty': 'warn',
      'no-unreachable': 'warn',
      'use-isnan': 'warn',
      eqeqeq: 'warn',
      'no-alert': 'warn',
      'no-else-return': 'warn',
      'no-multi-spaces': 'warn',
      'no-self-compare': 'warn',
      'no-useless-return': 'warn',
      camelcase: 'off',
      'no-undef': 'off',
      'no-undef-init': 'warn',
      'no-unused-vars': 'off',
      'no-use-before-define': 'warn',
      'no-plusplus': 'warn',
      'no-trailing-spaces': 'warn',
      'semi-spacing': 'warn',
      'linebreak-style': 'off',
      'no-console': 'off',
      'comma-dangle': 'off',
      'no-useless-constructor': 'off',
      'max-classes-per-file': 'off',
      'no-param-reassign': 'off',
      'func-names': 'off',
      'max-len': 'off',
      'no-new': 'off',
      'new-cap': 'off',
      'operator-linebreak': 'off',
      'object-curly-newline': 'off',
      'no-shadow': 'off',
      'consistent-return': 'off',
      'import/no-dynamic-require': 'off',
      'global-require': 'off',
      indent: 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-underscore-dangle': 'off',
      'no-return-await': 'off',
      'no-useless-escape': 'off',
      'no-new-func': 'off',
      'no-restricted-syntax': 'off',
      'no-extra-boolean-cast': 'off',
      'implicit-arrow-linebreak': 'off',

      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
