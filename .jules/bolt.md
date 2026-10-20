## 2026-10-20 - Negative Micro-Optimization
**Learning:** Avoid negative micro-optimizations such as wrapping primitive/basic ternary string operations or simple `switch` statements returning strings in a `React.useMemo` hook, as the overhead of invoking the hook is costlier than evaluating the simple logic.
**Action:** Always evaluate simple switch logic or simple ternary logic inline without `useMemo`.
