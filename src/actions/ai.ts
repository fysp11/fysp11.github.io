import { defineAction } from "astro:actions"
import { z } from "astro:schema"
import { runCreativeAgent } from "@/lib/langchain/creativeAgent"

const CACHE_TTL_SECONDS = 60 * 60 * 24 // 24 hours

const textEncoder = new TextEncoder()

async function hashPrompt(prompt: string): Promise<string> {
  const data = textEncoder.encode(prompt)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const ai = {
  createRandomPrompt: defineAction({
    handler: async () => {
      const prompts = [
        "A magical forest with glowing mushrooms and fairies dancing in the air",
        "A futuristic cityscape with flying cars and advanced technology",
        "A underwater city with mermaids and sea creatures",
        "A space station with advanced technology and spacewalkers",
        "A medieval castle with knights and dragons",
        "A futuristic city with flying cars and advanced technology",
        "A underwater city with mermaids and sea creatures",
        "A space station with advanced technology and spacewalkers",
        "A medieval castle with knights and dragons",
        "A futuristic city with flying cars and advanced technology",
        "A underwater city with mermaids and sea creatures",
        "A space station with advanced technology and spacewalkers",
        "A medieval castle with knights and dragons"
      ]
      const randomIndex = Math.floor(Math.random() * prompts.length)
      return prompts[randomIndex]
    }
  }),
  generateImage: defineAction({
    input: z.object({
      prompt: z.string()
    }),
    handler: async ({ prompt }, context) => {
      // Access Cloudflare AI binding through Astro's runtime context
      const runtimeEnv = context.locals.runtime?.env as ENV | undefined
      const AI = runtimeEnv?.AI
      const cache = runtimeEnv?.AI_CACHE

      // Check if AI binding is available
      if (!AI || typeof AI.run !== "function") {
        throw new Error(
          'Cloudflare Workers AI binding "AI" not found. Configure a Workers AI binding named "AI" in your Cloudflare Pages project (Settings → Functions → Bindings).'
        )
      }

      const cacheKey = cache ? `image:${await hashPrompt(prompt)}` : null

      if (cache && cacheKey) {
        const cachedImage = await cache.get(cacheKey)
        if (cachedImage) {
          return {
            imageBase64: cachedImage
          }
        }
      }

      // Use Cloudflare Workers AI with Flux model for image generation
      const result = await AI.run("@cf/black-forest-labs/flux-1-schnell", {
        prompt: prompt
      })

      if (!result || typeof result !== "object" || !("image" in result)) {
        throw new Error("No image generated")
      }

      // Workers AI returns the image already base64-encoded
      const imageBase64 = (result as { image: string }).image

      if (cache && cacheKey) {
        try {
          await cache.put(cacheKey, imageBase64, { expirationTtl: CACHE_TTL_SECONDS })
        } catch (cacheError) {
          console.warn("Failed to cache generated image", cacheError)
        }
      }

      return {
        imageBase64
      }
    }
  }),

  generateStory: defineAction({
    input: z.object({
      prompt: z.string()
    }),
    handler: async ({ prompt }, context) => {
      // Access Cloudflare AI binding through Astro's runtime context
      const runtimeEnv = context.locals.runtime?.env as ENV | undefined
      const AI = runtimeEnv?.AI
      const cache = runtimeEnv?.AI_CACHE

      if (!AI || typeof AI.run !== "function") {
        throw new Error(
          'Cloudflare Workers AI binding "AI" not found. Configure a Workers AI binding named "AI" in your Cloudflare Pages project (Settings → Functions → Bindings).'
        )
      }

      const cacheKey = cache ? `story:${await hashPrompt(prompt)}` : null

      if (cache && cacheKey) {
        try {
          const cachedStory = await cache.get(cacheKey)
          if (cachedStory) {
            return { story: cachedStory }
          }
        } catch (cacheError) {
          console.warn("Failed to read cached story", cacheError)
        }
      }

      // Use Cloudflare Workers AI with Llama model for text generation
      const result = await AI.run("@cf/meta/llama-3.1-8b-instruct", {
        prompt: prompt
      })

      if (!result || typeof result !== "object" || !("response" in result)) {
        throw new Error("No story generated")
      }

      const story = (result as { response: string }).response

      if (cache && cacheKey) {
        try {
          await cache.put(cacheKey, story, { expirationTtl: CACHE_TTL_SECONDS })
        } catch (cacheError) {
          console.warn("Failed to cache generated story", cacheError)
        }
      }

      return { story }
    }
  }),

  runCreativeAgent: defineAction({
    input: z.object({
      instruction: z.string().min(1, "Instruction is required"),
      tone: z.string().optional(),
      style: z.string().optional(),
      generateImage: z.boolean().optional(),
      imageArtStyle: z.string().optional(),
      imageLighting: z.string().optional(),
      imageColorPalette: z.string().optional(),
      imageLens: z.string().optional(),
      imageRendering: z.string().optional(),
      detailLevel: z.string().optional()
    }),
    handler: async (
      { instruction, tone, style, generateImage, imageArtStyle, imageLighting, imageColorPalette, imageLens, imageRendering, detailLevel },
      context
    ) => {
      const runtimeEnv = context.locals.runtime?.env as ENV | undefined
      const AI = runtimeEnv?.AI

      if (!AI || typeof AI.run !== "function") {
        throw new Error(
          'Cloudflare Workers AI binding "AI" not found. Configure a Workers AI binding named "AI" in your Cloudflare Pages project (Settings → Functions → Bindings).'
        )
      }

      const result = await runCreativeAgent(
        {
          instruction,
          tone: tone ?? null,
          style: style ?? null,
          generateImage: generateImage ?? false,
          imageArtStyle: imageArtStyle ?? null,
          imageLighting: imageLighting ?? null,
          imageColorPalette: imageColorPalette ?? null,
          imageLens: imageLens ?? null,
          imageRendering: imageRendering ?? null,
          detailLevel: detailLevel ?? null
        },
        AI
      )

      return result
    }
  })
}
