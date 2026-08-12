## 2024-08-13 - [Information Leakage in API Routes]
**Vulnerability:** The API routes (`ai-chat.ts`, `ai-image.ts`, `google-chat.ts`, `tts.ts`) were returning actual error messages (e.g., `(err as Error).message`) or downstream API failure body strings directly to the client in 500/502 JSON responses.
**Learning:** Returning detailed error messages (like stack traces or internal downstream errors) to the client can expose internal infrastructure details, API keys, or backend constraints to an attacker, facilitating reconnaissance.
**Prevention:** Always follow the "Fail securely" principle. Log the detailed error server-side (e.g., `console.error`) for debugging, but only return a generic error message (like "Internal error" or "Server error") to the client.
