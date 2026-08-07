## 2023-10-27 - [Astro Image in React]
**Learning:** Astro's built-in `<Image />` component from `astro:assets` is not supported inside React UI components (`.tsx` files). Using it can lead to missing properties like `src` or failing to render properly. Standard HTML `<img>` tags must be used instead in React components.
**Action:** When working on React components (`.tsx`), avoid using Astro components like `<Image />`. Use standard HTML `<img>` tags and ensure attributes like `className` (not `class`) are used correctly for React.
