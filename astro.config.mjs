import { defineConfig, loadEnv } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');

// https://astro.build/config
const siteFromEnv =
  env.SITE ||
  (env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : 'https://fysp11.github.io');

export default defineConfig({
  site: siteFromEnv,
  integrations: [react(), sitemap()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});
