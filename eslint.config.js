import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import tailwind from "eslint-plugin-tailwindcss"

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ["node_modules", "dist", "build", ".next", "**/*.astro"],
  },
  js.configs.recommended,
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
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      tailwindcss: tailwind,
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
      "tailwindcss/classnames-order": "error",
      quotes: ["error", "double"],
      semi: ["error", "never"],

      // Sensible React Hooks defaults
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]
