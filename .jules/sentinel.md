## 2024-10-18 - Information Leakage in API Responses
**Vulnerability:** API routes returned detailed error messages, internal structures (e.g. `(err as Error).message`), and raw external API responses (e.g. `result` from AI services) directly to the client.
**Learning:** Detailed error messages and raw downstream responses should not be directly forwarded to clients as they can leak sensitive information about external APIs, infrastructure details, and potential sensitive key constraints to attackers.
**Prevention:** Always log detailed error messages and raw downstream responses server-side (e.g., using `console.error`), but return only generic, pre-defined JSON error messages (like `"Internal error"`) to the client.
