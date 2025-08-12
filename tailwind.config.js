import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  mode: "jit",
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/styles/globals.css",
  ],
  theme: {
    container: {},
    extend: {
      keyframes: {},
      animation: {},
      backgroundColorContrast: {
        dark: "var(--color-dark)", // Dark background color
        light: "var(--color-light)", // Light background color
      },
      fontSize: {
        20: "20px",
      },
      spacing: {
        3: "3px",
        4: "4px",
      },
      colors: {
        "custom-gray": "#525252",
      },
    },
  },
  plugins: [animate],
}
