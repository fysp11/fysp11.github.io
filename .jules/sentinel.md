## 2024-10-15 - Prevent Information Leakage in API Error Handling
**Vulnerability:** API endpoints in `src/pages/api/*` were catching errors and returning the raw error messages or downstream HTTP responses directly to the client.
**Learning:** Returning raw error objects or unhandled third-party service responses directly to the frontend allows sensitive system information, potential API keys, and stack traces to be leaked, helping attackers map the application environment.
**Prevention:** Always fail securely. Ensure that `catch` blocks log the actual error objects or third-party responses server-side (using `console.error`), and only return generic JSON error messages (e.g., "Internal error", "Server error") with the appropriate 5xx HTTP status code to the client.
