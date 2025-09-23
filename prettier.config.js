/** @type {import('prettier').Config} */
const config = {
  printWidth: 100,
  singleQuote: false,
  semi: false,
  trailingComma: "none",
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss"
  ]
};

export default config;
