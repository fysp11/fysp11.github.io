## 2024-07-28 - Avoid Astro Image component in React TSX files

**Learning:** Astro's built-in `<Image />` component from `astro:assets` is not supported inside React UI components (`.tsx` files) in this codebase, and using it causes bundle and rendering issues.
**Action:** Always use standard HTML `<img>` tags in `.tsx` files instead of `<Image />` from `astro:assets`. Ensure standard JSX attribute naming (e.g., `className`, `fetchPriority`) is used.
