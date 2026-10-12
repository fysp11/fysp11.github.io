## 2024-10-12 - Remove negative micro-optimization in useMemo
**Learning:** Wrapping basic primitive string evaluations (like simple `switch` statements) in `React.useMemo` is a negative micro-optimization. The overhead of invoking the `useMemo` hook and maintaining its dependency array is actually costlier than simply evaluating the logic directly on every render.
**Action:** Avoid using `useMemo` for trivial scalar or string evaluations in React components; instead, compute them directly in the render flow.
