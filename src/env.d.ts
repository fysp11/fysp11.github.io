/// <reference types="astro/client" />
/// <reference types="astro/client-image" />

// Cloudflare AI types
interface Ai {
  run(model: string, options: Record<string, unknown>): Promise<unknown>
}

interface AiCacheNamespace {
  get(key: string): Promise<string | null>
  put(
    key: string,
    value: string,
    options?: {
      expiration?: number
      expirationTtl?: number
    }
  ): Promise<void>
}

// Cloudflare environment with AI binding
type ENV = {
  AI: Ai
  AI_CACHE?: AiCacheNamespace
  AI_GATEWAY_ACCOUNT_ID?: string
  AI_GATEWAY_GATEWAY_NAME?: string
  GOOGLE_AI_STUDIO_TOKEN?: string
}

// Cloudflare runtime configuration
type Runtime = import("@astrojs/cloudflare").Runtime<ENV>

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Locals extends Runtime {}
}
