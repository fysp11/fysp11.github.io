import type { APIRoute } from 'astro';

export const prerender = false;

interface GoogleChatRequest {
  model?: string; // e.g., "gemini-1.5-flash" or "gemini-1.5-pro"
  prompt: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;

    const accountId = env.AI_GATEWAY_ACCOUNT_ID as unknown as string | undefined;
    const gatewayName = env.AI_GATEWAY_GATEWAY_NAME as unknown as string | undefined;
    const googleToken = env.GOOGLE_AI_STUDIO_TOKEN as unknown as string | undefined;

    if (!accountId || !gatewayName || !googleToken) {
      return json(
        {
          error:
            'Missing AI Gateway configuration. Please set AI_GATEWAY_ACCOUNT_ID, AI_GATEWAY_GATEWAY_NAME, and GOOGLE_AI_STUDIO_TOKEN in your Cloudflare Pages project settings.',
        },
        500
      );
    }

    const body = (await request.json()) as GoogleChatRequest;
    if (!body || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return json({ error: 'Missing prompt' }, 400);
    }

    const model = typeof body.model === 'string' && body.model.length > 0 ? body.model : 'gemini-1.5-flash';

    const url = `https://gateway.ai.cloudflare.com/v1/${encodeURIComponent(
      accountId
    )}/${encodeURIComponent(gatewayName)}/google-ai-studio/v1/models/${encodeURIComponent(
      model
    )}:generateContent`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': googleToken,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: body.prompt }],
          },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await safeText(resp);
      return json({ error: 'Google AI Studio call failed', status: resp.status, body: text }, 502);
    }

    const data = (await resp.json()) as GoogleResponse;
    const text = extractText(data);

    return json({ provider: 'google-ai-studio', model, text, raw: data });
  } catch (err) {
    return json({ error: (err as Error).message ?? 'Internal error' }, 500);
  }
};

// Types for a subset of Google AI Studio response
interface GoogleResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

function extractText(resp: GoogleResponse): string {
  const parts = resp.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? '').join('').trim();
}

async function safeText(r: Response): Promise<string> {
  try {
    return await r.text();
  } catch {
    return '';
  }
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
