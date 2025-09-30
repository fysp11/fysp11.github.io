// eslint.config.js (Flat config for ESLint 9)
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';


// Astro
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';


// Tailwind
import tailwind from 'eslint-plugin-tailwindcss';

import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig(
  {
    ignores: [
      "dist/**",
      ".astro/**",           // Astro build cache
      "node_modules/**",
      ".wrangler/**"
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro (*.astro) support
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        // Let astro parser delegate <script> blocks to TS parser
        parser: tseslint.parser,   // works even without a tsconfig, but better with one
        extraFileExtensions: [".astro"],
        // Uncomment if you want TS project service features:
        // projectService: true,
        // tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      astro: astroPlugin,
    },
    // If your installed eslint-plugin-astro exposes a flat "recommended" config,
    // you can merge it. Otherwise, the hand-picked rules below are a sane start.
    rules: {
      // Core Astro rules
      "astro/no-conflict-set-directives": "error",
      "astro/no-set-html-directive": "warn",
      "astro/no-unused-define-vars-in-style": "warn",

      // Optional: stylistic hints for component APIs
      "astro/prefer-class-list-directive": "off",
    },
  },

  // Optional: tighten general rules across the repo
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off",                // let TS handle this
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "eqeqeq": ["warn", "smart"],
    },
  },
  {
  files: ["**/*.{js,jsx,ts,tsx,astro}"],
  plugins: { tailwindcss: tailwind },
  rules: {
    "tailwindcss/no-custom-classname": "off" // or "warn"
  }
},
  eslintConfigPrettier
)
