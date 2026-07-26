## 2024-07-26 - Astro Image Component Compatibility
**Learning:** Astro's built-in `<Image />` component from `astro:assets` is not supported inside React UI components (.tsx files) in this codebase. Attempting to use it can lead to bundle/rendering issues and build errors.
**Action:** Always use standard HTML `<img>` tags inside `.tsx` files in Astro, and manually apply image optimization attributes (`loading`, `fetchPriority`, `decoding`).
