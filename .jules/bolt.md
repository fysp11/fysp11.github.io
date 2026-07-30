## 2025-02-09 - Pre-optimizing Dynamic Assets

**Learning:** When using Astro's `getImage()` function to optimize dynamically referenced images located in the `/public` directory, passing the string path directly is insufficient for build-time processing. The images must first be resolved to `ImageMetadata` using `import.meta.glob<{ default: ImageMetadata }>('/public/.../*')` and the resolved module passed as the `src` to `getImage()`.

**Action:** When migrating from client-side `<Image>` components to server-side processed `<img>` tags in React components, first glob the directory in the `.astro` file and use the matched modules with `getImage()` to pre-process images at build time.
