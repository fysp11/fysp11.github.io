import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
const siteFromEnv =
  process.env.SITE ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://fysp11.github.io');

export default defineConfig({
  site: siteFromEnv,
  integrations: [react(), sitemap()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});
