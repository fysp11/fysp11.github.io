import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Only block indexing on preview deployments, not production
  // CF_PAGES_BRANCH is 'main' or 'production' for production, any other value for preview
  const isPreview = 
    (import.meta.env.CF_PAGES_BRANCH && 
     import.meta.env.CF_PAGES_BRANCH !== 'main' && 
     import.meta.env.CF_PAGES_BRANCH !== 'production') || 
    import.meta.env.MODE !== 'production';
  
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
