## 2025-01-20 - [Performance Issue: Astro Images inside React Client Components]
**Learning:** You cannot easily use Astro's `astro:assets` `<Image />` component inside a React `.tsx` component. The components will fail to correctly render optimized images or process paths during client hydration.
**Action:** Process images on the server-side first (in `.astro` files) using `import.meta.glob<{ default: ImageMetadata }>` and `getImage()`. Then pass the resolved `.src` string into the React component and use a standard HTML `<img>` tag to render it.

## 2025-01-20 - [Performance Optimization Pattern: Index-based loading priority in maps]
**Learning:** When rendering lists of images (like a project gallery), naive lazy loading delays LCP, and naive eager loading destroys initial load bandwidth.
**Action:** When mapping over items to render images, always use the index to determine load priority: `isAboveFold = index < 4`. Set `fetchPriority="high"` and `loading="eager"` for above the fold, and `loading="lazy"` with `decoding="async"` for the rest.
