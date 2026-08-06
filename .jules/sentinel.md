
## 2024-05-15 - Secure Error Handling in API Routes
**Vulnerability:** API routes (`ai-chat.ts`, `ai-image.ts`, `google-chat.ts`, `tts.ts`) were leaking internal errors, raw downstream AI results, and internal environment variable requirements to the client in their `catch` blocks and fallback responses.
**Learning:** Returning `err.message` or raw error objects in API responses can expose stack traces, internal configuration details, and sensitive downstream API metadata, violating the "fail securely" principle.
**Prevention:** Always log the actual error and downstream response details server-side using `console.error` for debugging, but only return a safe, generic JSON error message (e.g., `{ error: "Internal error" }`) to the client. Avoid exposing internal environment variable names or raw downstream payload structures in API responses.
