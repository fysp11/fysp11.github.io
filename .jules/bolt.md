## 2024-05-24 - Do not use <Image /> from astro:assets inside React components
**Learning:** The Astro `<Image />` component from `astro:assets` is not supported inside React UI components (`.tsx` files). This applies even if it appears to compile. Standard HTML `<img>` tags must be used instead, and images can be optimized dynamically on the server level in the Astro component using `getImage()`, then passed as strings to React components.
**Action:** When rendering images in `.tsx` files in Astro, use standard HTML `<img>` tags and pass server-optimized image URLs as strings.
## 2024-05-24 - Image loading optimization pattern for loops
**Learning:** Applying `loading="eager"` and `fetchPriority="high"` to all images inside a loop creates an anti-pattern that causes network contention. Only the first few initial viewport images should use eager loading and high priority, with the rest falling back to `loading="lazy"`.
**Action:** When rendering a list of images, conditionally apply eager loading and high fetch priority using the loop index (e.g. `index < 2`), and always append `decoding="async"` to prevent blocking the main thread.
