## 2025-03-05 - Remove negative micro-optimization in useCreativeAgent
**Learning:** Avoid negative micro-optimizations such as wrapping primitive/basic operations or simple `switch` statements returning strings in a `React.useMemo` hook. The overhead of invoking the hook is costlier than evaluating the simple logic.
**Action:** Do not use `useMemo` for simple derivations; only use it for expensive computations or referential equality preservation.
