## 2025-03-01 - Information Leakage via API Error Responses
**Vulnerability:** API routes (e.g., `ai-chat.ts`, `ai-image.ts`, `google-chat.ts`, `tts.ts`) were returning actual error messages (e.g. `(err as Error).message`) directly to the client in JSON responses.
**Learning:** This defaults to leaking internal system implementation details or sensitive configuration paths, as internal errors may contain stack traces or third party error contexts.
**Prevention:** Return generic error messages (e.g. "Internal server error") in JSON responses returned to the client and log internals securely on the backend (e.g. `console.error`).
