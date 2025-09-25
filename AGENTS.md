# Agents.md — Development Guide for AstroJS Project

This file guides AI development tools (Google Jules, OpenAI Codex, Windsurf) on how to contribute effectively to this project.

---

## 📂 Project Overview

- Framework: **AstroJS**
- Styling: **TailwindCSS v4**
- Linting: **ESLint 9 + Prettier**
- TypeScript: enabled
- Deployment: Vercel / Static Export

---

## 🚦 General Workflow

1. **Understand the task**
   - If adding a feature → check `/src/pages` or `/src/components`.
   - If fixing a bug → replicate issue locally with `pnpm dev`.

2. **Follow conventions**
   - Use **TypeScript** for all new code.
   - Use **.astro** for pages/components, **.ts/.tsx** for logic-heavy parts and state/client components.
   - Keep components **small and composable**, following SOLID principles.

3. **Run checks before commit**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm build
````

---

## 🎨 Styling

* Use **TailwindCSS v4** utility classes.
* Define custom colors in `src/styles/globals.css`:

  ```css
  @theme {
    --color-primary: rgba(15, 23, 42, 1);
    --color-accent: rgba(204, 251, 241, 1);
  }
  ```

Prefer semantic classes: bg-primary, text-accent.

---

## 📄 Pages & Routing

* Pages live in `/src/pages`.
* Example:

  * `/src/pages/index.astro` → `/`
  * `/src/pages/blog/[slug].astro` → dynamic blog routes
* For layouts: create `/src/layouts/BaseLayout.astro`.

---

## 🛠️ Features Implementation

* New components → `/src/components/FeatureName.astro`.
* State logic → keep in `.ts` helpers, imported into `.astro`.
* If interactivity needed → use `client:load` / `client:visible` wisely.

---

## 🤖 AI Features

This project integrates with Google Gemini to provide AI-powered features.

-   **Core Tech**: Google Gemini, Vercel AI SDK.
-   **Location**: AI-related components can be found in `/src/components/ai/`.
-   **Configuration**: To enable AI features locally, you must create a `.env` file and add the following keys:
    ```
    GOOGLE_GENERATIVE_AI_API_KEY="YOUR_GEMINI_API_KEY"
    AI_GATEWAY_API_KEY="YOUR_GATEWAY_API_KEY"
    ```
-   **Note**: When working on AI features, ensure your environment is correctly configured with these keys.

---

## 🐛 Bug Resolution

1. Reproduce the issue.
2. Add a failing test if possible (`/tests`).
3. Fix with minimal changes.
4. Run all checks before commit.

---

## 🔍 Code Quality

* **ESLint 9** with `eslint.config.mjs`:

  * `plugin:@typescript-eslint/recommended`
  * `plugin:astro/recommended`
* **Prettier** handles formatting.
* Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`).

---

## 📊 Observability

* Add logs only where useful (`console.debug` in dev).
* Remove debug logs before merge.
* For analytics → use PostHog/Telemetry hooks.

---

## ✅ Checklist for AI Contributions

* [ ] Follow Astro file conventions (`.astro` for UI, `.ts` for logic, `.tsx`for state/client components).
* [ ] Respect TailwindCSS semantic tokens.
* [ ] Add tests for new features and bugfixes.
* [ ] Ensure `pnpm check` passes.
* [ ] Document new code in comments where non-trivial.

---

## 🚀 Example Task Flow

**Task:** Add a dark mode toggle.
Steps:

1. Create `ThemeToggle.astro` in `/src/components`.
2. Use Tailwind `dark:` utilities.
3. Save theme in `localStorage`.
4. Import into layout:

   ```astro
   ---
   import ThemeToggle from "../components/ThemeToggle.astro";
   ---
   <header>
     <ThemeToggle />
   </header>
   ```

---

## 📌 Notes

* Do not bypass `agents.md`.
* Keep PRs small and focused.
* Escalate uncertainties with TODO comments instead of guessing.

---
