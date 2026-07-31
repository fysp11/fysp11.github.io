## 2024-05-24 - [Secure Error Handling in API Routes]
**Vulnerability:** [API endpoints were leaking raw error messages (including upstream provider response bodies and raw objects) to the client.]
**Learning:** [This is a security anti-pattern because it can leak internal server paths, dependency versions, or upstream service constraints.]
**Prevention:** [Replace verbose error messages with generic, safe error messages returned to the client, while properly logging the detailed errors to the server console for debugging.]
