## 2024-10-21 - Generic JSON Errors to Prevent Data Leakage
**Vulnerability:** API routes returned detailed error messages (including potentially internal or downstream provider errors) to the client.
**Learning:** Returning explicit internal error details is a security risk as it can expose sensitive architectural information or dependencies.
**Prevention:** Always log the full error server-side via `console.error` and return a generic JSON error message (e.g., "Internal server error") to the client.
