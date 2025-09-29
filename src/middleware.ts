import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Only block indexing on preview deployments, not production
  const isPreview = import.meta.env.VERCEL_ENV === 'preview' || import.meta.env.MODE !== 'production';
  
  const response = await next();
  
  if (isPreview) {
    // Block indexing on preview deployments
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  } else {
    // Allow indexing on production
    response.headers.set('X-Robots-Tag', 'all');
  }
  
  return response;
});
