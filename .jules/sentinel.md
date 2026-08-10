## 2024-05-18 - [Fix API Error Leakage]
**Vulnerability:** API endpoints were leaking original error messages (including detailed AI gateway/API key failures) directly to the client via JSON responses in `src/pages/api/*.ts`.
**Learning:** Returning `error.message` or downstream response bodies in API error handlers risks exposing internal infrastructure details or credentials.
**Prevention:** Always log detailed error information server-side using `console.error` and return a generic, standardized JSON error message (e.g., `{"error": "Internal Server Error"}`) to the client.
