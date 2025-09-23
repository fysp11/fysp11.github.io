import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
const siteFromEnv =
  import.meta.env.SITE ||
  (import.meta.env.VERCEL_URL
    ? `https://${import.meta.env.VERCEL_URL}`
    : 'https://fysp11.github.io');

export default defineConfig({
  site: siteFromEnv,
  integrations: [react(), sitemap()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});
