import type { APIRoute } from 'astro';

export const prerender = false;

interface ImageRequest {
  model?: string;
  prompt: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const AI = locals.runtime.env.AI;
    if (!AI) return json({ error: 'AI binding not available' }, 500);

    const body = (await request.json()) as ImageRequest;
    if (!body || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return json({ error: 'Missing prompt' }, 400);
    }

    const defaultModel = '@cf/black-forest-labs/flux-1-schnell';
    const model = typeof body.model === 'string' && body.model.length > 0 ? body.model : defaultModel;

    const result = (await AI.run(model, { prompt: body.prompt })) as unknown;

    if (!isImageResult(result)) {
      return json({ error: 'No image generated', result }, 500);
    }

    // Workers AI returns base64-encoded image string
    return json({ model, imageBase64: result.image, contentType: 'image/png' });
  } catch (err) {
    return json({ error: (err as Error).message ?? 'Internal error' }, 500);
  }
};

function isImageResult(x: unknown): x is { image: string } {
  return !!x && typeof x === 'object' && 'image' in x;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
