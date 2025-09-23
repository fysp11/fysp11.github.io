// eslint.config.js (Flat config for ESLint 9)
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

// TypeScript
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

// Astro
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';

// React (optional)
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

// Tailwind
import tailwind from 'eslint-plugin-tailwindcss';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 0) ignores
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      '.astro',
      'src/components/ui/*'
    ]
  },

  // 1) base JS
  js.configs.recommended,
  // turn off stylistic rules; let Prettier handle formatting
  eslintConfigPrettier,

  // 2) Astro files
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        // If you use TS inside <script> in .astro:
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: { astro: astroPlugin },
    rules: {
      ...astroPlugin.configs.recommended.rules,
      // (optional) chill some noisy rules:
      'astro/no-set-html-directive': 'off'
    }
  },

  // 3) TS/JS/React app code
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
        // project-aware rules: uncomment if you want them
        // project: true,
        // tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      tailwindcss: tailwind
    },
    settings: {
      react: { version: 'detect' },
      tailwindcss: {
        // With Tailwind v4, the plugin doesn’t need to load JS config.
        // Use false for robustness or point to the file if you do need it.
        config: false,
        callees: ['cn'] // your className helper(s)
      }
    },
    rules: {
      // TS
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],

      // React (optional)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Tailwind
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off'
    }
  }
];
