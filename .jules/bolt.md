## 2024-10-25 - Negative Micro-Optimization hook overhead
**Learning:** Avoid wrapping simple switch statements returning strings in `React.useMemo`. The hook overhead is costlier than evaluating the logic.
**Action:** Move trivial switch statements outside the hook entirely, or use an IIFE (Immediately Invoked Function Expression) to evaluate the logic directly.
