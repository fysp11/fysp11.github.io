## 2026-10-11 - [useMemo on Trivial Switch Statements]
**Learning:** In React, wrapping a simple switch statement that returns static strings in a `useMemo` hook is a negative micro-optimization. The overhead of the hook invocation is costlier than evaluating the logic directly.
**Action:** Always evaluate trivial operations (like mapping a state to a string via a switch or ternary operator) directly on render without `useMemo` or extract them to simple utility functions outside the component.
