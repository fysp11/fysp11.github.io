## 2024-11-20 - Using getImage with public directory

**Learning:** Astro's `getImage` function can accept a direct string path for images in the `/public` directory without resolving it via `import.meta.glob`, provided that both `width` AND `height` properties are explicitly passed in the options object. Using `import.meta.glob` on `/public` will return string paths instead of the `ImageMetadata` required for `getImage`'s `src` property, leading to build failures.

**Action:** When optimizing dynamically referenced images located in the `/public` directory using `getImage`, use the string path directly (e.g., `src: "/images/projects/foo.jpg"`) and ensure both `width` and `height` are provided to prevent errors. Do not try to resolve them via `import.meta.glob`.
