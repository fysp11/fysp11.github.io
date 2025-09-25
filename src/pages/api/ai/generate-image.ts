import type { APIRoute } from 'astro';
import { generateText } from 'ai';

export const prerender = false;

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const result = await generateText({
      model: 'google/gemini-2.5-flash-image-preview',
      providerOptions: {
        google: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Generate an image based on the following prompt: "${prompt}"`,
            },
          ],
        },
      ],
    });

    const imageFiles = result.files?.filter((f) => f.mediaType?.startsWith('image/'));

    if (!imageFiles || imageFiles.length === 0) {
      return new Response(JSON.stringify({ error: 'No image was generated' }), { status: 500 });
    }

    const generatedImage = imageFiles[0];

    const imageBase64 = generatedImage.base64;

    return new Response(JSON.stringify({ imageBase64 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in generate-image POST handler:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), { status: 500 });
  }
};
