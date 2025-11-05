import type { APIRoute } from "astro"

const MAX_TEXT_LENGTH = 2000

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.error("[TTS API] Received TTS request")

    if (request.method !== "POST") {
      console.error("[TTS API] Invalid method:", request.method)
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      })
    }

    const body = await request.json()
    const { text, voice } = body as { text?: string; voice?: string }

    console.error(`[TTS API] Request: text length=${text?.length}, voice=${voice}`)

    if (!text || typeof text !== "string") {
      console.error("[TTS API] Missing or invalid text parameter")
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    if (text.length > MAX_TEXT_LENGTH) {
      console.error(`[TTS API] Text exceeds max length: ${text.length} > ${MAX_TEXT_LENGTH}`)
      return new Response(
        JSON.stringify({ error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    if (!voice || typeof voice !== "string") {
      console.error("[TTS API] Missing or invalid voice parameter")
      return new Response(JSON.stringify({ error: "Voice is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Get Cloudflare AI binding from locals
    const runtimeEnv = locals.runtime?.env as { AI?: unknown } | undefined
    const AI = runtimeEnv?.AI

    if (!AI || typeof AI !== "object" || !("run" in AI)) {
      console.error("[TTS API] Cloudflare AI binding not available")
      return new Response(
        JSON.stringify({
          error: 'Cloudflare Workers AI binding "AI" not found. Configure a Workers AI binding in your Cloudflare Pages project.'
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    console.error(`[TTS API] Calling Cloudflare AI with voice: ${voice}`)

    try {
      const result = await (AI as { run: (model: string, payload: unknown) => Promise<unknown> }).run(
        "@cf/myshell-ai/melotts",
        {
          prompt: text,
          voice
        }
      )

      console.error("[TTS API] AI call successful")

      // melotts returns an object with an 'audio' property containing base64-encoded audio
      let audioBuffer: ArrayBuffer | null = null

      if (result instanceof ArrayBuffer) {
        audioBuffer = result
      } else if (result && typeof result === "object") {
        const resultObj = result as Record<string, unknown>
        
        // Check for base64-encoded audio string
        if (typeof resultObj.audio === "string") {
          console.error("[TTS API] Found base64 audio string, decoding...")
          try {
            // Decode base64 to binary string
            const binaryString = atob(resultObj.audio)
            // Convert binary string to ArrayBuffer
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            audioBuffer = bytes.buffer
            console.error(`[TTS API] Decoded base64 audio: ${audioBuffer.byteLength} bytes`)
          } catch (decodeError) {
            console.error("[TTS API] Failed to decode base64 audio:", decodeError)
          }
        } else if (resultObj.array_buffer instanceof ArrayBuffer) {
          audioBuffer = resultObj.array_buffer
        } else if (resultObj.arrayBuffer instanceof ArrayBuffer) {
          audioBuffer = resultObj.arrayBuffer
        } else if (resultObj.data instanceof ArrayBuffer) {
          audioBuffer = resultObj.data
        }
      }

      if (!audioBuffer) {
        console.error("[TTS API] Could not find audio in response")
        return new Response(JSON.stringify({ error: "Invalid response from AI service" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      }

      if (audioBuffer.byteLength === 0) {
        console.error("[TTS API] Empty audio buffer received")
        return new Response(JSON.stringify({ error: "No audio generated" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      }

      console.error(`[TTS API] Returning audio buffer: ${audioBuffer.byteLength} bytes`)

      return new Response(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-cache"
        }
      })
    } catch (aiError) {
      const errorMsg = aiError instanceof Error ? aiError.message : String(aiError)
      console.error(`[TTS API] AI service error: ${errorMsg}`)
      return new Response(JSON.stringify({ error: `AI service error: ${errorMsg}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`[TTS API] Unexpected error: ${errorMsg}`)
    return new Response(JSON.stringify({ error: `Server error: ${errorMsg}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
