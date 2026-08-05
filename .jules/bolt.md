## 2025-10-18 - Astro Image in React
**Learning:** Astro's built-in `<Image />` component from `astro:assets` causes hydration issues and fails inside React components (`.tsx`). Attempting to use it directly bypasses build-time optimizations and leads to runtime bugs.
**Action:** Always compute optimized image URLs at the server level in `.astro` files using Astro's `getImage()` with `import.meta.glob<{ default: ImageMetadata }>`, then pass the resulting optimized string URLs as props down to React components to render with standard HTML `<img>` tags.

## 2025-10-18 - React fetchPriority Type Checking
**Learning:** The `fetchPriority` attribute on `<img>` tags in React components (`.tsx`) is supported by the project's TypeScript configuration. Adding `@ts-expect-error` above it causes a `TS2578: Unused '@ts-expect-error' directive` error and breaks the build.
**Action:** Do not use `@ts-expect-error` for `fetchPriority` in React components; the types are correctly resolved.
