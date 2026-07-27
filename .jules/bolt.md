
## 2024-05-18 - Astro Image Optimization inside React Components
**Learning:** You cannot use Astro's `<Image />` component directly inside a React (.tsx) UI component (it will cause hydration/rendering errors and output standard Astro `class=` instead of React's `className=`).
**Action:** When working with React components in Astro, compute the optimized image URL at the server level (in the `.astro` file) using Astro's `getImage()` function, then pass the optimized string URL as a prop down to a standard HTML `<img>` tag in the React component.

## 2024-05-18 - Avoid Primitive Memoization Micro-optimizations
**Learning:** Wrapping a basic ternary string operation (e.g. `const classes = view === "grid" ? "x" : "y"`) in a `React.useMemo` hook is a "negative micro-optimization". The cost of evaluating the simple inline ternary is much faster than the overhead of hook invocation, allocation, and tracking dependencies.
**Action:** Do not use `useMemo` for primitives, fast logic, or non-expensive computations. Save `useMemo` specifically for computationally heavy routines or when ensuring referential equality for child component memoization.
