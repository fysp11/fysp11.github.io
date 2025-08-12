// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

const ContentSecurityPolicy = `
  default-src * data:;
  style-src 'self' 'unsafe-inline';
  style-src-elem 'self' https://fonts.googleapis.com/ 'unsafe-inline';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live/ https://va.vercel-scripts.com/ https://vitals.vercel-insights.com/ https://www.googletagmanager.com/ https://www.google-analytics.com/;
  font-src 'self' https://fonts.gstatic.com/ 'unsafe-inline';
  object-src 'none';
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin"
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim()
  }
];

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });
  return response;
});
