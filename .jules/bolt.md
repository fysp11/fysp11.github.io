## 2024-05-14 - React useMemo Anti-Pattern
**Learning:** Wrapping simple string derivations (e.g. evaluating a switch statement to return a string) in `React.useMemo` is a negative micro-optimization. The overhead of the hook itself (invocation, dependency tracking, closure creation) is heavier than re-evaluating the simple primitives on each render.
**Action:** Do not use `useMemo` for basic string, boolean, or numeric logic that does not involve complex mapping, filtering, or heavy calculations. Rely on standard local variables instead.
