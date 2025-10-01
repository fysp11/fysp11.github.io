import type { APIRoute } from "astro"

export const prerender = false

// Minimal types for request payload
interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool"
  content:
    | string
    | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>
}

interface ChatRequest {
  model?: string
  prompt?: string
  messages?: ChatMessage[]
  // Optional generation params
  max_tokens?: number
  temperature?: number
  top_p?: number
  top_k?: number
  seed?: number
  repetition_penalty?: number
  frequency_penalty?: number
  presence_penalty?: number
  raw?: boolean
  stream?: boolean
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const AI = locals.runtime.env.AI
    if (!AI) {
      return json({ error: "AI binding not available" }, 500)
    }

    const body = (await request.json()) as ChatRequest

    const defaultModel = "@cf/meta/llama-3.1-8b-instruct"
    const model = body.model && typeof body.model === "string" ? body.model : defaultModel

    // Build payload for Workers AI
    const payload: Record<string, unknown> = {}

    if (Array.isArray(body.messages) && body.messages.length > 0) {
      payload.messages = body.messages
    } else if (typeof body.prompt === "string" && body.prompt.trim().length > 0) {
      payload.prompt = body.prompt
    } else {
      return json({ error: "Provide either prompt (string) or messages (array)" }, 400)
    }

    // Optional params passthrough
    if (typeof body.max_tokens === "number") payload.max_tokens = body.max_tokens
    if (typeof body.temperature === "number") payload.temperature = body.temperature
    if (typeof body.top_p === "number") payload.top_p = body.top_p
    if (typeof body.top_k === "number") payload.top_k = body.top_k
    if (typeof body.seed === "number") payload.seed = body.seed
    if (typeof body.repetition_penalty === "number")
      payload.repetition_penalty = body.repetition_penalty
    if (typeof body.frequency_penalty === "number")
      payload.frequency_penalty = body.frequency_penalty
    if (typeof body.presence_penalty === "number") payload.presence_penalty = body.presence_penalty
    if (typeof body.raw === "boolean") payload.raw = body.raw
    if (typeof body.stream === "boolean") payload.stream = body.stream

    const result = (await AI.run(model, payload)) as unknown

    if (isTextResult(result)) {
      return json({ model, response: result.response })
    }

    // Fallback: return raw result for debugging purposes
    return json({ model, result })
  } catch (err) {
    return json({ error: (err as Error).message ?? "Internal error" }, 500)
  }
}

function isTextResult(x: unknown): x is { response: string } {
  return !!x && typeof x === "object" && "response" in x
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  })
}
