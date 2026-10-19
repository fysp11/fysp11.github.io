## 2024-03-24 - React useMemo anti-pattern on primitives
**Learning:** Wrapping simple primitive string evaluation (e.g. a simple switch statement returning strings) in `React.useMemo` is an anti-pattern. The overhead of invoking the `useMemo` hook is often costlier than evaluating the simple logic itself.
**Action:** Replace `useMemo` with direct string evaluation or helper functions for simple, primitive-returning logic that doesn't involve expensive object creation or heavy computation.
