## 2024-05-24 - Sensitive Data Leakage in API Error Messages
**Vulnerability:** Backend API routes (Cloudflare workers AI, Google AI Studio) were capturing raw error objects (`err.message`, `errorMsg`, stack traces, response text) and returning them directly to the client in HTTP 500/502 JSON responses.
**Learning:** Returning raw system errors to clients reveals internal architecture, dependency versions, and upstream provider details, which could be leveraged by attackers for targeted exploitation or intelligence gathering.
**Prevention:** Always employ secure error handling boundaries. Catch blocks should log the detailed error and stack trace server-side (e.g., using `console.error`) while returning only a generic JSON error message (e.g., "Internal server error") to the client.
