## 2024-10-09 - Information Exposure in API Routes
**Vulnerability:** API routes were leaking internal error strings, exception stacks, and raw fallback responses to downstream clients in `src/pages/api/`.
**Learning:** Catching errors server-side and piping them directly into JSON responses exposes sensitive internal architecture and service dependencies.
**Prevention:** Always log detailed error responses server-side (e.g., using `console.error`) and strictly return generic messages like `{"error": "Internal Server Error"}` to the client.
