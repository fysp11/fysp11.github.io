import type { APIRoute } from 'astro';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const prerender = false;

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }
    console.log({now: new Date().toISOString(), prompt})
    const result = await generateText({
      model: google('gemini-2.5-flash-image-preview'),
      prompt: `Generate an image based on the following prompt: "${prompt}"`,
      providerOptions: {
        google:{
          responseModalities: ['IMAGE'],
        }
      },
      maxRetries:1
    });

    if (!result) {
      throw new Error('No image generated');
    }

    const firstFile = result.files[0];

    if (!firstFile?.mediaType.startsWith('image/')) {
      throw new Error('No image generated');
    }

    const imageBase64 = firstFile.base64;

    return new Response(JSON.stringify({ imageBase64 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {error
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
};
