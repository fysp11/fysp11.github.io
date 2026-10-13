## 2026-10-13 - [Performance Anti-Pattern: useMemo for basic string switch]
**Learning:** Simple string evaluations (such as `switch` or ternary statements) should not be wrapped in `React.useMemo`. The overhead of invoking the hook is costlier than evaluating the simple string return logic directly.
**Action:** Avoid wrapping basic logic like returning strings from switch/ternary statements in `useMemo`. Evaluate them directly.
