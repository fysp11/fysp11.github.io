/// <reference types="astro/client" />
/// <reference types="astro/client-image" />

// Cloudflare AI types
interface Ai {
  run(model: string, options: Record<string, unknown>): Promise<unknown>;
}

// Cloudflare environment with AI binding
type ENV = {
  AI: Ai;
};

// Cloudflare runtime configuration
type Runtime = import('@astrojs/cloudflare').Runtime<ENV>;

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Locals extends Runtime {}
}
