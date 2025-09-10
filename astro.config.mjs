import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
const siteFromEnv = process.env.SITE || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export default defineConfig({
  site: siteFromEnv,
  integrations: [react(), tailwind(), sitemap()],
  output: 'static',
});
