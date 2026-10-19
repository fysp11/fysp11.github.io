## 2026-10-19 - Negative Micro-Optimization
**Learning:** Avoid wrapping simple string-returning `switch` statements in a `React.useMemo` hook, as the overhead of invoking the hook is costlier than evaluating the simple logic.
**Action:** Evaluate simple string-returning operations directly without `useMemo`.
