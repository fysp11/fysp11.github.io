## 2025-02-08 - [Astro Image Component in React]
**Learning:** [Astro's built-in `<Image />` component from `astro:assets` is not supported inside React UI components (`.tsx` files). Using it fails to apply build-time optimizations (like WebP conversion and resizing) or causes hydration errors.]
**Action:** [To maintain build-time image optimization, move the `getImage()` call to the server level (in the `.astro` file) and pass down the optimized image URL strings to standard `<img>` tags inside the React components.]
