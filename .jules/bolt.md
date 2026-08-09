## 2024-05-19 - Optimizing Image Loading inside React Components in Astro

**Learning:** Astro's built-in `<Image />` component from `astro:assets` is unsupported and fails when used inside React UI components (`.tsx` files). Additionally, dynamically referencing images located in the `/public` directory via `getImage()` requires first resolving them to `ImageMetadata` to avoid build-time errors when dimensions are not manually specified.

**Action:** When passing images to React components in Astro, compute the optimized image URL at the server level (in the `.astro` file) by first using `import.meta.glob<{ default: ImageMetadata }>('/public/.../*')` to resolve the modules, passing the resolved metadata into `getImage()`, and then passing the resulting optimized string URL as a prop. Inside the React component, use a standard HTML `<img>` tag and manually add performance attributes (`fetchPriority="high"`, `loading="eager"`, and `decoding="async"`) for above-the-fold images to optimize LCP.
## 2024-05-19 - Conditional LCP Image Loading in React/Astro loops

**Learning:** Applying `loading="eager"` and `fetchPriority="high"` to all images inside a mapping loop is a severe performance anti-pattern. Eagerly loading an unbounded list of images—including those below the fold—causes network contention, competes with critical resources, and actually degrades LCP and overall page load time.

**Action:** When mapping over items and rendering images inside components, always use the loop index (e.g., `index < 2`) to conditionally apply eager loading and high fetch priority *only* to the truly critical images (above-the-fold), while enforcing `loading="lazy"` on all others to prevent blocking the main thread.
