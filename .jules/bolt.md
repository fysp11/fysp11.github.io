## 2024-03-24 - Avoid negative micro-optimizations and optimize base64 images
**Learning:** Using `useMemo` for simple logic like switch statements causes negative micro-optimizations, as hook overhead exceeds the performance gained. Additionally, base64 data URIs should not be lazy-loaded, but must include `decoding="async"` to prevent main-thread blocking when rendering.
**Action:** Replace `useMemo` with direct functions or variables for simple logic blocks. Always append `decoding="async"` to image tags using base64 encoded strings to prevent jank.
