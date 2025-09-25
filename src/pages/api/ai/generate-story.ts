import type { APIRoute } from 'astro';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { prompt } = await request.json();

  const result = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    prompt,
  });

  return new Response(result.textStream);
};
