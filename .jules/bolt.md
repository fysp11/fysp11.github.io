## 2025-02-12 - Fix Astro Image inside React UI components
**Learning:** Using Astro's built-in `<Image />` component from `astro:assets` inside React UI components (`.tsx` files) is not supported and causes build errors or performance hits when reverting to standard images.
**Action:** To retain build-time performance benefits (WebP conversion, resizing), compute the optimized image URL at the server level (in the `.astro` file) using `import.meta.glob` and Astro's `getImage()` function, then pass the optimized string URL as a prop down to the React component.
