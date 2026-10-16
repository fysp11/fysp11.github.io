## 2026-10-16 - Removed unnecessary useMemo for basic string mapping
**Learning:** Using `useMemo` for simple logic like mapping strings via a `switch` statement introduces unnecessary hook invocation overhead that is costlier than evaluating the logic itself.
**Action:** Avoid wrapping basic ternary string operations or simple conditional assignments in `useMemo`. Instead, rely on direct evaluation inline.
