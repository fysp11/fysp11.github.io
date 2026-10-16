## 2024-05-18 - Prevent Information Leakage in API Routes
**Vulnerability:** API routes were leaking internal error messages (e.g., `err.message`) and downstream provider response bodies (e.g., Google AI Studio error text) directly to the client via JSON responses.
**Learning:** Using `catch (err) { return json({ error: err.message }, 500) }` exposes internal architecture, logic flaws, or sensitive connection details to external users, violating the principle of failing securely.
**Prevention:** Always log detailed error messages and downstream response texts server-side (e.g., using `console.error`) and return generic error messages like `"Internal error"` or `"Service error"` to the client.
