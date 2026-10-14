
## 2024-05-18 - Avoid unnecessary useMemo for simple string switches
**Learning:** Wrapping basic ternary string operations or simple `switch` statements returning strings in a `React.useMemo` hook is a negative micro-optimization. The overhead of invoking the hook is costlier than evaluating the simple logic.
**Action:** Do not use `useMemo` for simple derivations or state projections (like string formatting or switch statements). Reserve it for computationally expensive operations or preserving referential equality of complex objects/arrays.
