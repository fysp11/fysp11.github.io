
## 2024-05-24 - Fix Error Response Data Leakage
**Vulnerability:** API route error handlers (ai-chat.ts, google-chat.ts, tts.ts, ai-image.ts) were returning `err.message` and raw body texts from downstream services directly to the client in JSON responses.
**Learning:** Returning actual exception messages or raw downstream texts directly can expose internal configuration, downstream service details, or application state to users. This is a common pattern in initial API implementations.
**Prevention:** Catch blocks in API routes should log the detailed error internally (`console.error` server-side) and return only generic "Internal server error" or similar safe messages to the client. Ensure robust logging for debugging without compromising security.
