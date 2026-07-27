## 2024-07-27 - Sensitive Data Leakage in API Error Responses
**Vulnerability:** Backend API routes (ai-chat.ts, google-chat.ts, ai-image.ts, tts.ts) were returning raw error messages `(err as Error).message` in HTTP responses on failure.
**Learning:** Returning raw application errors directly to clients leaks internal implementation details, potential file paths, dependencies logic, or API response bodies which could be used by attackers.
**Prevention:** Always log full errors server-side (using `console.error` or a logger) and return generic error messages (e.g., "Internal server error") to the client.
