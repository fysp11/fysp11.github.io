## 2026-10-14 - React useMemo Anti-Pattern
**Learning:** Wrapping simple primitive string operations (like a switch statement returning strings based on state) in `React.useMemo` is a negative micro-optimization. The overhead of invoking the hook is costlier than evaluating the simple logic on every render.
**Action:** Avoid using `useMemo` for simple string concatenation or switch statements. Reserve `useMemo` for expensive computations or referential equality of objects/arrays.
