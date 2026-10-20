## 2024-10-21 - Remove negative micro-optimization for primitive strings
**Learning:** Wrapping a basic `switch` statement that returns simple primitive strings in a `React.useMemo` hook is a negative micro-optimization. The overhead of invoking the hook is actually costlier than evaluating the simple logic on each render.
**Action:** Avoid using `useMemo` for simple string derivations or ternary operations. Only use it when the computation is actually expensive.
