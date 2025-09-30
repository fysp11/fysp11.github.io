import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const ai = {
  generateImage: defineAction({
    input: z.object({
      prompt: z.string(),
    }),
    handler: async ({ prompt }, context) => {
      // Access Cloudflare AI binding through Astro's runtime context
      const AI = context.locals.runtime.env.AI;

      // Use Cloudflare Workers AI with Flux model for image generation
      const result = await AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: prompt,
      });

      if (!result || typeof result !== 'object' || !('image' in result)) {
        throw new Error('No image generated');
      }

      // Convert the image ArrayBuffer to base64
      const imageBuffer = (result as { image: ArrayBuffer }).image;
      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(imageBuffer))
      );

      return {
        imageBase64: base64,
      };
    },
  }),

  generateStory: defineAction({
    input: z.object({
      prompt: z.string(),
    }),
    handler: async ({ prompt }, context) => {
      // Access Cloudflare AI binding through Astro's runtime context
      const AI = context.locals.runtime.env.AI;

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
