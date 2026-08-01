## 2024-05-18 - [Information Leakage in API Route Handlers]
**Vulnerability:** Multiple API routes (`ai-chat.ts`, `ai-image.ts`, `google-chat.ts`, `tts.ts`) were returning internal error messages (e.g. `(err as Error).message`, raw error bodies, raw fetch body values) directly to clients via 500/502 JSON responses.
**Learning:** Returning unhandled exception messages directly to the client can inadvertently expose sensitive architectural details, stack traces, internal paths, or API configuration parameters.
**Prevention:** In API route catch blocks and error handling paths, always log the detailed `error` server-side (e.g. via `console.error`) and respond to the client with a generic error object (e.g., `{ error: "Internal error" }`).
