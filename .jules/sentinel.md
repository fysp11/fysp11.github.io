
## 2025-02-28 - Secure API Error Handling to Prevent Information Leakage
**Vulnerability:** API routes (e.g., `ai-chat.ts`, `ai-image.ts`, `google-chat.ts`, `tts.ts`) were exposing internal system states by returning raw downstream responses and detailed exception stack messages (e.g., specific HTTP failure bodies, specific AI model error details) directly to the client when failures occurred.
**Learning:** Returning detailed downstream errors in public JSON responses can leak infrastructure details, service configurations, and potentially keys/tokens if they're echoed in upstream API errors. Backend route boundaries must act as information sanitizers.
**Prevention:** Always log specific, detailed errors on the server side (using `console.error`) for internal observability, and return a standardized, generic error string (e.g., "Internal server error" or "AI service error") to the client.
