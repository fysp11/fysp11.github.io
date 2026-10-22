## 2024-10-23 - API Error Handling Information Disclosure

**Vulnerability:** API routes (`ai-chat`, `ai-image`, `google-chat`, `tts`) were catching exceptions and directly returning raw error messages, raw stack traces, and complete third-party response payloads to the client.
**Learning:** Returning `(err as Error).message` or raw responses directly in HTTP 500 error payloads leaks implementation details (such as missing bindings or third-party schema issues) which can be leveraged for reconnaissance.
**Prevention:** Always log detailed exception and error states server-side (using `console.error`) and strictly return generic error messages (e.g., "Internal server error") with standard HTTP status codes (500 or 502) to the client.
