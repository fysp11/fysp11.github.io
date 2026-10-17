## 2024-10-18 - Hydration Mismatch Risk
**Learning:** Moving `localStorage` reads out of a `useEffect` and into a `useState` lazy initializer to prevent a double-render causes a React Hydration Mismatch in Server-Side Rendered (SSR) applications (like Astro) because the server and client will render differently initially.
**Action:** Always keep `localStorage` reads inside a `useEffect` (or handle with an external blocking script) when working in SSR environments to ensure the client and server HTML match during hydration.
