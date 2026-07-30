## 2024-05-24 - [Information Exposure in API Error Handling]
**Vulnerability:** Raw AI responses (like raw base64 generated images, internal status codes, and exact text data from Google and CF AI) as well as internal system `Error.message` strings were returned directly to the client when API calls failed in `/pages/api/*`.
**Learning:** Returning unhandled raw errors on the frontend leaks infrastructure context (like downstream providers' internal errors) and makes APIs overly verbose during failures which exposes server internals to standard users.
**Prevention:** Always follow secure error handling for server API routes by logging detailed internal errors server-side via `console.error` and restricting client JSON payloads on failure to generic, safe status messages.
