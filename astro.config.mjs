import { defineConfig } from 'astro/config';
import process from 'node:process';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
const siteFromEnv =
  process.env.SITE ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://fysp11.github.io');

export default defineConfig({
  site: siteFromEnv,
  output: 'server',
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build:{
      chunkSizeWarningLimit:900
    }
  }
});
