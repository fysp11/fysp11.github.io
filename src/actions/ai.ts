import { defineAction } from 'astro:actions';
import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'astro:schema';

export const ai = {
  generateImage: defineAction({
    input: z.object({
      prompt: z.string(),
    }),
    handler: async ({ prompt }) => {
      console.log({ now: new Date().toISOString(), prompt });

      const result = await generateText({
        model: google('gemini-2.5-flash-image-preview'),
        prompt: `Generate an image based on the following prompt: "${prompt}"`,
        providerOptions: {
          google: {
            responseModalities: ['IMAGE'],
          },
        },
        maxRetries: 1,
      });

      if (!result) {
        throw new Error('No image generated');
      }

      const firstFile = result.files[0];

      if (!firstFile?.mediaType.startsWith('image/')) {
        throw new Error('No image generated');
      }

      return {
        imageBase64: firstFile.base64,
      };
    },
  }),

  generateStory: defineAction({
    input: z.object({
      prompt: z.string(),
    }),
    handler: async ({ prompt }) => {
      const result = await streamText({
        model: google('models/gemini-1.5-flash'),
        prompt,
      });

      // Astro Actions do not support streaming responses directly.
      // We have to buffer the entire response.
      let fullStory = '';
      for await (const delta of result.textStream) {
        fullStory += delta;
      }

      return { story: fullStory };
    },
  }),
};
