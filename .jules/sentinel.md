## 2024-07-26 - [Sensitive Data Exposure in Error Responses]

**Vulnerability:** Several API endpoints (`google-chat.ts`, `ai-chat.ts`, `ai-image.ts`, `tts.ts`) were interpolating the internal error messages and stack traces (such as downstream error payloads or system exception details) directly into the JSON responses returned to the client on failure.
**Learning:** This is a common pattern when quickly building out API routes but poses a risk of leaking environment details, cloudflare binding names, and service credentials.
**Prevention:** In the future, always log the real error server-side (e.g., using `console.error`) and return a generic error message (like "Internal error") to the client.
