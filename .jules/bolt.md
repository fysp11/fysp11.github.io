## 2025-03-09 - [Astro Asset Optimization in React]
**Learning:** Using Astro's `<Image />` component inside a `.tsx` file is unsupported. We must pre-compute WebP optimized URLs at the server-level (`.astro`) using `import.meta.glob` to resolve paths, and pass `ImageMetadata` into `getImage()`.
**Action:** Do not use `<Image />` in React files. Generate image urls via `getImage()` server side and pass them to standard `<img>` tags in React, carefully adding conditional `loading="lazy"` and `fetchPriority` logic for below-the-fold images to maintain optimal LCP performance.
