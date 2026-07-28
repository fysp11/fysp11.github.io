## 2024-05-18 - Astro Image Component in React
**Learning:** Astro's built-in `<Image />` component from `astro:assets` is not supported inside React UI components (.tsx files) in this codebase. Attempting to use it fails or causes issues. Standard HTML `<img>` tags must be used instead.
**Action:** To retain build-time performance benefits (WebP conversion, resizing), compute the optimized image URL at the server level (in the `.astro` file) using Astro's `getImage()` function, then pass the optimized string URL as a prop down to the React component.
