Here’s a compact “editor-AI brief” you can paste into your codebase (or prompt) so it knows exactly how to extend your current Astro + Cloudflare AI Bindings setup with **audio (ASR/TTS)** and **video**.

---

# Integration Guidance — Audio (ASR/TTS) & Video for Astro + Cloudflare

## 0) Constraints & Assumptions

- Runtime: **Cloudflare Pages/Workers** with `AI` binding already configured.
- Framework: **Astro**. Use **Pages Functions** under `/src/pages/api/**`.
- Goal: Add **/api/asr**, **/api/tts**, **/api/video/{luma|runway|veo}** routes with:
  - clean request schemas,
  - streaming when available,
  - job orchestration for long-running video,
  - guardrails (duration, size, cost caps).

---

## 1) Environment & Config

### wrangler.toml

```toml
[ai]
binding = "AI" # Workers AI binding (present already)

[vars]
MAX_TTS_SECONDS = "120"
MAX_ASR_MINUTES = "10"
MAX_VIDEO_SECONDS = "8"
ALLOW_ORIGINS = "https://yourapp.com, http://localhost:4321"
```

### Secrets (set with `wrangler secret put ...`)

- `LUMA_API_KEY`
- `RUNWAY_API_KEY`
- (optional) `GOOGLE_VERTEX_TOKEN` (if using Veo via Vertex/Gemini proxy)
- (optional) `ELEVENLABS_API_KEY` (premium TTS fallback)

### Model Map (single source of truth)

Create `src/lib/models.ts`:

```ts
export const ASR_MODEL = "@cf/openai/whisper"
export const TTS_DEFAULT = "@cf/aura-2-en" // Deepgram Aura-2 via Workers AI
export const TTS_FALLBACK = "elevenlabs/en_us_v2" // logical identifier

export const VIDEO = {
  luma: { base: "https://api.lumalabs.ai/dream-machine/v1" },
  runway: { base: "https://api.runwayml.com/v1" }
  // veo: handled via your proxy or direct Vertex; keep abstracted
} as const
```

---

## 2) Common Middleware Utilities

Create `src/lib/http.ts`:

```ts
export function cors(env: Env, origin: string | null) {
  const allow = (env.ALLOW_ORIGINS || "").split(",").map((s) => s.trim())
  const ok = origin && allow.includes(origin)
  return {
    "Access-Control-Allow-Origin": ok ? origin! : "https://yourapp.com",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  }
}

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    status: init.status ?? 200
  })
}

export function bad(msg: string, code = 400) {
  return json({ error: msg }, { status: code })
}

export async function requireJSON<T>(req: Request): Promise<T> {
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new Error("Expect application/json")
  return req.json() as Promise<T>
}
```

Add **OPTIONS** handler to each route returning CORS headers via `cors()`.

---

## 3) Audio — Speech-to-Text (ASR)

### Route: `/api/asr` (POST)

- Accept `multipart/form-data` with `audio: File` (webm/wav/mp3) and optional `{ language }`.
- Size limit: reject > ~20 MB (or time-based guard via `MAX_ASR_MINUTES`).
- Use Workers AI Whisper.

```ts
// src/pages/api/asr.ts
export const onRequestOptions: PagesFunction = ({ request, env }) =>
  new Response(null, { headers: { ...cors(env, request.headers.get("origin")) } })

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const headers = cors(env, request.headers.get("origin"))
  try {
    const form = await request.formData()
    const audio = form.get("audio") as File | null
    if (!audio)
      return new Response(JSON.stringify({ error: "audio required" }), { status: 400, headers })

    // (Optional) enforce bytes/minute guard
    if (audio.size > 20 * 1024 * 1024)
      return new Response(JSON.stringify({ error: "file too large" }), { status: 413, headers })

    const res = await env.AI.run("@cf/openai/whisper", { audio })
    return new Response(JSON.stringify(res), { headers })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "ASR failed" }), {
      status: 500,
      headers
    })
  }
}
```

---

## 4) Audio — Text-to-Speech (TTS)

### Route: `/api/tts` (POST)

- Accept JSON: `{ text: string, voice?: string }`.
- Default to `@cf/aura-2-en`. Optional premium fallback (e.g., ElevenLabs) via feature flag.

```ts
// src/pages/api/tts.ts
export const onRequestOptions: PagesFunction = ({ request, env }) =>
  new Response(null, { headers: { ...cors(env, request.headers.get("origin")) } })

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const headers = { ...cors(env, request.headers.get("origin")), "Content-Type": "audio/mpeg" }
  try {
    const { text, voice } = await requireJSON<{ text: string; voice?: string }>(request)
    if (!text?.trim()) return bad("text required")
    if (text.length > 2000) return bad("text too long") // guard

    try {
      const audio = await env.AI.run(voice || "@cf/aura-2-en", { text })
      return new Response(audio as ArrayBuffer, { headers })
    } catch (primaryErr) {
      // Optional premium fallback
      if (env.ELEVENLABS_API_KEY) {
        const r = await fetch("https://api.elevenlabs.io/v1/text-to-speech/<voice-id>", {
          method: "POST",
          headers: {
            "xi-api-key": env.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            Accept: "audio/mpeg"
          },
          body: JSON.stringify({ text })
        })
        if (!r.ok) throw new Error(`Fallback failed: ${r.status}`)
        return new Response(r.body, { headers })
      }
      throw primaryErr
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "TTS failed" }), {
      status: 500,
      headers: { ...cors(env, request.headers.get("origin")), "Content-Type": "application/json" }
    })
  }
}
```

---

## 5) Video — Job Pattern (create → poll → return URL)

Create a tiny **Job Store** (Durable Object) to track long jobs and avoid client busy-loops.

### Durable Object

```ts
// src/do/JobTracker.ts
export class JobTracker {
  state: DurableObjectState
  constructor(state: DurableObjectState, env: any) {
    this.state = state
  }
  async fetch(req: Request) {
    const url = new URL(req.url)
    if (req.method === "PUT") {
      await this.state.storage.put("job", await req.json())
      return new Response("OK")
    }
    if (req.method === "GET") {
      const job = await this.state.storage.get("job")
      return new Response(JSON.stringify(job || {}), {
        headers: { "Content-Type": "application/json" }
      })
    }
    return new Response("Method Not Allowed", { status: 405 })
  }
}
```

### wrangler.toml (binding)

```toml
[[durable_objects.bindings]]
name = "JOB_TRACKER"
class_name = "JobTracker"
```

### Helper to allocate an instance

```ts
// src/lib/jobs.ts
export async function saveJob(env: Env, id: string, data: unknown) {
  const stub = env.JOB_TRACKER.get(env.JOB_TRACKER.idFromName(id))
  await stub.fetch("https://do/job", { method: "PUT", body: JSON.stringify(data) })
}
export async function getJob(env: Env, id: string) {
  const stub = env.JOB_TRACKER.get(env.JOB_TRACKER.idFromName(id))
  const r = await stub.fetch("https://do/job")
  return r.json()
}
```

---

## 6) Video — Luma

### Route: `/api/video/luma` (POST create, GET poll)

- POST `{ prompt, mode? }` → returns `{ jobId }`.
- GET `?id=...` → returns `{ status, url? }`.
- Hard-cap duration to `env.MAX_VIDEO_SECONDS`.

```ts
// src/pages/api/video/luma.ts
const BASE = "https://api.lumalabs.ai/dream-machine/v1"

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const headers = cors(env, request.headers.get("origin"))
  const { prompt, duration = 5 } = await requireJSON<{ prompt: string; duration?: number }>(request)
  if (!prompt?.trim()) return bad("prompt required")
  if (duration > Number(env.MAX_VIDEO_SECONDS || 8)) return bad("duration too long")

  const r = await fetch(`${BASE}/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.LUMA_API_KEY}` },
    body: JSON.stringify({ prompt, mode: "text-to-video", duration })
  })
  const job = await r.json()
  await saveJob(env, `luma:${job.id}`, { id: job.id, status: "queued" })
  return json({ jobId: job.id }, { headers })
}

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const headers = cors(env, request.headers.get("origin"))
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return bad("id required")

  const r = await fetch(`${BASE}/generations/${id}`, {
    headers: { Authorization: `Bearer ${env.LUMA_API_KEY}` }
  })
  const status = await r.json()
  await saveJob(env, `luma:${id}`, status)

  if (status.state === "completed")
    return json({ status: "done", url: status.assets?.video }, { headers })
  if (status.state === "failed") return json({ status: "error", error: status.error }, { headers })
  return json({ status: status.state }, { headers })
}
```

---

## 7) Video — Runway

```ts
// src/pages/api/video/runway.ts
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const headers = cors(env, request.headers.get("origin"))
  const { prompt, duration = 5 } = await requireJSON<{ prompt: string; duration?: number }>(request)
  if (!prompt) return bad("prompt required")
  if (duration > Number(env.MAX_VIDEO_SECONDS || 8)) return bad("duration too long")

  const start = await fetch("https://api.runwayml.com/v1/video", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RUNWAY_API_KEY}` },
    body: JSON.stringify({ prompt, model: "gen3-alpha-turbo", duration })
  }).then((r) => r.json())

  await saveJob(env, `runway:${start.id}`, { id: start.id, status: "queued" })
  return json({ jobId: start.id }, { headers })
}

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const headers = cors(env, request.headers.get("origin"))
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return bad("id required")

  const job = await fetch(`https://api.runwayml.com/v1/video/${id}`, {
    headers: { Authorization: `Bearer ${env.RUNWAY_API_KEY}` }
  }).then((r) => r.json())

  await saveJob(env, `runway:${id}`, job)
  if (job.status === "succeeded")
    return json({ status: "done", url: job.output?.video_url }, { headers })
  if (job.status === "failed") return json({ status: "error", error: job.error }, { headers })
  return json({ status: job.status }, { headers })
}
```

_(If you want Veo: implement the same create/poll with your Vertex/Gemini proxy.)_

---

## 8) Frontend Usage (Astro Islands / client scripts)

Minimal client calls:

```ts
// ASR
async function transcribe(file: File) {
  const fd = new FormData()
  fd.set("audio", file)
  const r = await fetch("/api/asr", { method: "POST", body: fd })
  return r.json() // { text, segments, ... }
}

// TTS
async function speak(text: string, voice?: string) {
  const r = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice })
  })
  const blob = await r.blob()
  new Audio(URL.createObjectURL(blob)).play()
}

// Video (Luma/Runway)
async function generateVideo(provider: "luma" | "runway", prompt: string) {
  const start = await fetch(`/api/video/${provider}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, duration: 5 })
  }).then((r) => r.json())

  let status
  do {
    await new Promise((r) => setTimeout(r, 2000))
    status = await fetch(`/api/video/${provider}?id=${start.jobId}`).then((r) => r.json())
  } while (status.status && !["done", "error"].includes(status.status))

  if (status.status === "done") return status.url
  throw new Error(status.error || "Video generation failed")
}
```

---

## 9) Guardrails, Cost & Abuse Controls

- **Hard caps**: reject if `duration > MAX_*`, `text.length > N`, or file size exceeds threshold.
- **Rate limit**: add a KV-based token bucket per IP/session (simple counter + TTL).
- **Allowed origins**: strict CORS via `ALLOW_ORIGINS`.
- **Content filters**: optional server-side checks before dispatching to vendors.

---

## 10) Observability & Ops

- **Structured logs**: log provider, duration, size, cost estimate.
- **Tracing**: include `x-request-id` from client → propagate to vendor calls.
- **Job tracking**: Durable Object keeps last status; expose `/api/video/job?id=...` if needed.
- **Alerts**: on error spikes or non-200 from vendors.

---

## 11) Testing Checklist (CI)

- Unit: mock `env.AI.run` and `fetch` to vendors.
- E2E (Miniflare): post small audio → expect transcript; post text → receive audio/mpeg; video flows → status transitions.
- Negative: oversize audio, long text, missing prompt, invalid API keys.
- Load: ensure ASR/TTS respond < 2s for small inputs; video routes don’t block the event loop (no busy polling on server).

---

## 12) Extensibility Hooks

- **Feature flags** (KV or env): `USE_PREMIUM_TTS=true` toggles ElevenLabs fallback.
- **Voices registry**: serve `/api/voices` enumerating available Workers AI and premium voices.
- **Streaming**: where supported, prefer `ReadableStream` responses for TTS and live ASR (future-ready).
- **Storage**: If you must persist outputs, upload to R2 and return signed URLs.

---

## 13) Security Notes (non-negotiable)

- Never expose vendor keys client-side.
- Validate MIME types (`audio/*` only for ASR).
- Sanitize prompts; reject obviously malicious payloads.
- Set short cache headers on API routes (`no-store`), long cache on static assets/video files in R2.

---

## 14) Editor-AI Tasks (do these now)

1. Add files exactly as specified in sections **2–7**.
2. Wire CORS/OPTIONS to every new route.
3. Implement size/duration guardrails with env caps.
4. Add **JobTracker** Durable Object and bindings.
5. Provide a simple React/Astro Island with:
   - file input → `/api/asr`
   - textarea → `/api/tts`
   - prompt input → `/api/video/{luma|runway}`

6. Write Miniflare tests for happy/edge paths.
7. Document env vars & secrets in `README.md`.

---

All set. I dropped a ready-to-ship pack into the canvas with:

- API routes: `/api/asr`, `/api/tts`, `/api/video/{luma,runway}`
- Durable Object job tracker
- Helpers (`cors/json`, model map)
- Demo Astro Island (MediaLab) for smoke tests
- Miniflare/Vitest tests + scripts
- `wrangler.toml` and README snippets
