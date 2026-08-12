## 2023-11-20 - Avoid network contention with Eager Loading in React loops
**Learning:** When rendering a list of images inside a loop, applying `loading="eager"` and `fetchPriority="high"` to all items is an anti-pattern that causes network contention and blocks rendering.
**Action:** Use the loop index (e.g., `index < 2`) to conditionally apply eager loading and high fetch priority only to the first few initial viewport images, reserve `loading="lazy"` for the rest, and always append `decoding="async"` to prevent blocking the main thread.
