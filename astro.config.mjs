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
  build: {
    inlineStylesheets: 'always', // Inline all stylesheets to eliminate render-blocking CSS
  },
  adapter: vercel({
    edgeMiddleware: true,
    imagesConfig: {
      domains: ['localhost', 'fysp11.github.io', 'fysp.dev'],
      sizes: [640, 1024, 1280, 1536, 1792, 2048, 2560],
      format: 'webp',
      quality: 80,
    },
    isr: {
      fallback: 'revalidate',
      revalidate: 60 * 60 * 12, // 12h
    },
    webAnalytics: { enabled: true },
    experimentalStaticHeaders: true,
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
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
