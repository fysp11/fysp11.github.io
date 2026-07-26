## 2024-05-19 - Replacing Astro Image component inside React components
**Learning:** Astro's built-in `<Image />` component from `astro:assets` is not natively supported inside React UI components (.tsx) and causes bundle/rendering issues and invalid JSX properties (like `class` instead of `className`).
**Action:** When working in React components in this codebase, always use standard HTML `<img>` tags and apply appropriate `loading`, `fetchPriority`, and `decoding` attributes.
