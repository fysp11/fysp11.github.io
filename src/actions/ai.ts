import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

const textEncoder = new TextEncoder();

async function hashPrompt(prompt: string): Promise<string> {
  const data = textEncoder.encode(prompt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
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
        "A medieval castle with knights and dragons",
      ];
      const randomIndex = Math.floor(Math.random() * prompts.length);
      return prompts[randomIndex];
    },
  }),
  generateImage: defineAction({
    input: z.object({
      prompt: z.string(),
    }),
    handler: async ({ prompt }, context) => {
      // Access Cloudflare AI binding through Astro's runtime context
      const runtimeEnv = context.locals.runtime?.env as ENV | undefined;
      const AI = runtimeEnv?.AI;
      const cache = runtimeEnv?.AI_CACHE;

      // Check if AI binding is available
      if (!AI || typeof AI.run !== 'function') {
        throw new Error('Cloudflare Workers AI binding "AI" not found. Configure a Workers AI binding named "AI" in your Cloudflare Pages project (Settings → Functions → Bindings).');
      }

      const cacheKey = cache ? `image:${await hashPrompt(prompt)}` : null;
      console.debug('Prompt:', prompt)
      console.log('Cache key:', cacheKey);
      if (cache && cacheKey) {
        const cachedImage = await cache.get(cacheKey);
        if (cachedImage) {
          console.log('Cache hit');
          return {
            imageBase64: cachedImage,
          };
        }
      }

      console.log('Cache miss');
      // Use Cloudflare Workers AI with Flux model for image generation
      const result = await AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: prompt,
      });

      if (!result || typeof result !== 'object' || !('image' in result)) {
        throw new Error('No image generated');
      }

      // Workers AI returns the image already base64-encoded
      const imageBase64 = (result as { image: string }).image;

      if (cache && cacheKey) {
        console.log('Cache miss');
        try {
          console.log('Caching image', cacheKey);
          await cache.put(cacheKey, imageBase64, { expirationTtl: CACHE_TTL_SECONDS });
          console.log('Cached!');
        } catch (cacheError) {
          console.warn('Failed to cache generated image', cacheError);
        }
      }

      return {
        imageBase64,
      };
    },
  }),

  generateStory: defineAction({
    input: z.object({
      prompt: z.string(),
    }),
    handler: async ({ prompt }, context) => {
      // Access Cloudflare AI binding through Astro's runtime context
      const runtimeEnv = context.locals.runtime?.env as ENV | undefined;
      const AI = runtimeEnv?.AI;

      if (!AI || typeof AI.run !== 'function') {
        throw new Error('Cloudflare Workers AI binding "AI" not found. Configure a Workers AI binding named "AI" in your Cloudflare Pages project (Settings → Functions → Bindings).');
      }

      // Use Cloudflare Workers AI with Llama model for text generation
      const result = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt: prompt,
      });

      if (!result || typeof result !== 'object' || !('response' in result)) {
        throw new Error('No story generated');
      }

      return { story: (result as { response: string }).response };
    },
  }),
};
