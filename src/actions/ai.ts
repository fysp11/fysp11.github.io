import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

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
      const AI = context.locals.runtime.env.AI;

      // Check if AI binding is available
      if (!AI || typeof (AI as any).run !== 'function') {
        throw new Error('Cloudflare Workers AI binding "AI" not found. Configure a Workers AI binding named "AI" in your Cloudflare Pages project (Settings → Functions → Bindings).');
      }

      // Use Cloudflare Workers AI with Flux model for image generation
      const result = await AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: prompt,
      });

      if (!result || typeof result !== 'object' || !('image' in result)) {
        throw new Error('No image generated');
      }

      // Workers AI returns the image already base64-encoded
      return {
        imageBase64: (result as { image: string }).image,
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
