## 2025-02-18 - Prevent Sensitive Error Leakage in API Routes
**Vulnerability:** API routes returned detailed error messages directly to the client (e.g., exposing `(err as Error).message` instead of a generic message).
**Learning:** Returning actual internal error strings or full trace structures can leak details about internal infrastructure or specific failures to an end user.
**Prevention:** Always log specific error details server-side (e.g., using `console.error`) while returning generic error messages (e.g., "Internal error") to the client.
