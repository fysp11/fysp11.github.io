import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import tailwind from "eslint-plugin-tailwindcss"
import eslintConfigPrettier from "eslint-config-prettier"

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ["node_modules", "dist", "build", ".next", "**/*.astro", "src/components/ui/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["*.mjs", "postcss.config.js", "prettier.config.js", "tailwind.config.js"],
    languageOptions: {
      globals: {
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        // If you use project-aware rules, enable and point to tsconfig here.
        // project: true,
        // tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        // Browser globals to avoid no-undef in client code
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        URL: "readonly",
        SVGSVGElement: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      tailwindcss: tailwind,
      "@typescript-eslint": tsPlugin,
    },
    settings: {
      react: { version: "detect" },
      tailwindcss: {
        callees: ["cn"],
        config: "tailwind.config.js",
      },
    },
    rules: {
      // Carried over from previous config
      "react/jsx-key": "off",
      "tailwindcss/no-custom-classname": "off",
      // Avoid failing CI on minor ordering nits; Prettier handles formatting
      "tailwindcss/classnames-order": "warn",

      // Defer formatting to Prettier
      quotes: "off",
      semi: "off",

      // Prefer TS-aware unused vars and ignore leading underscore
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" }
      ],

      // Sensible React Hooks defaults
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]
