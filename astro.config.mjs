import { defineConfig } from 'astro/config';
import process from 'node:process';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
const siteFromEnv =
  process.env.SITE ||
  (process.env.CF_PAGES_URL
    ? process.env.CF_PAGES_URL
    : 'https://fysp11.github.io');

export default defineConfig({
  site: siteFromEnv,
  output: 'server',
  build: {
    inlineStylesheets: 'always', // Inline all stylesheets to eliminate render-blocking CSS
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'cloudflare',
    routes: {
      strategy: 'auto',
    },
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
      cssCodeSplit: true,
      assetsInlineLimit: 8192, // Inline assets smaller than 8KB
      cssMinify: 'lightningcss', // Use faster CSS minification
      modulePreload: {
        polyfill: false, // Reduce bundle size by skipping polyfill
      },
    },
    css: {
      transformer: 'lightningcss', // Use Lightning CSS for better performance
    },
  }
});
