# Cloudflare Deployment Guide

This guide covers deploying your Astro project to Cloudflare Workers/Pages.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Your project connected to a Git repository (GitHub, GitLab, etc.)

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

Cloudflare Pages automatically deploys your project from Git with zero configuration.

#### Steps:

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages**

2. **Create a New Project**
   - Click **Create application** → **Pages** → **Connect to Git**
   - Select your repository

3. **Configure Build Settings**
   ```
   Build command: pnpm build
   Build output directory: dist
   Root directory: /
   ```

4. **Set Environment Variables**
   Add the following in **Settings** → **Environment variables**:
   
   **Production Variables:**
   ```
   PUBLIC_GA_ID=your_google_analytics_id
   PUBLIC_GTM_ID=your_google_tag_manager_id
   PUBLIC_HS_ID=your_hubspot_id
   PUBLIC_ENABLED_PROJECT_DEMOS=3d,ai
   ENABLED_PROJECTS=3d,ai
   ```

5. **Enable Workers AI Binding**
   - Workers AI is automatically available on Cloudflare Pages
   - No additional configuration needed - the AI binding is set in `wrangler.toml`

6. **Deploy**
   - Click **Save and Deploy**
   - Your site will be live at `<project-name>.pages.dev`
   - AI features will work automatically with no additional setup

### Option 2: Cloudflare Workers (via Wrangler CLI)

For more control over deployment:

#### Steps:

1. **Install Wrangler**
   ```bash
   pnpm add -D wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   pnpm wrangler login
   ```

3. **Configure wrangler.toml**
   The `wrangler.toml` file is already configured. Update the name if needed:
   ```toml
   name = "your-project-name"
   ```

4. **Deploy**
   ```bash
   pnpm build
   pnpm wrangler pages deploy dist
   ```

## AI Integration with Cloudflare Workers AI

This project uses **Cloudflare Workers AI** for serverless AI inference:

### Benefits
- ✅ **No API Keys**: AI binding is automatically available
- ✅ **Serverless GPUs**: Run models without managing infrastructure
- ✅ **50+ Models**: Access to open-source models (Llama, Flux, etc.)
- ✅ **Pay-per-use**: Only pay for what you use
- ✅ **Type-Safe**: Full TypeScript support via Astro Actions
- ✅ **Global Network**: Models run on Cloudflare's edge

### Models Used
- **Text Generation**: `@cf/meta/llama-3.1-8b-instruct` (Meta Llama 3.1)
- **Image Generation**: `@cf/black-forest-labs/flux-1-schnell` (Flux 1)

### Setup
The AI binding is configured in `wrangler.toml`:
```toml
[ai]
binding = "AI"
```

No additional configuration or API keys required! AI features work automatically when deployed to Cloudflare Pages/Workers.

## Custom Domain

1. Go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions

## Environment-Specific Deployments

### Preview Deployments
- Every branch push creates a preview deployment
- Preview URLs: `<branch-name>.<project-name>.pages.dev`
- Automatically blocked from search engines (`noindex`)

### Production Deployments
- Triggered by pushes to `main` or `production` branch
- Production URL: `<project-name>.pages.dev` or your custom domain

## Monitoring & Analytics

### Built-in Analytics
- Go to your Pages project → **Analytics**
- View requests, bandwidth, and errors

### Web Analytics
- Enable Web Analytics in Cloudflare Dashboard
- No JavaScript needed, privacy-friendly

## Troubleshooting

### Build Fails
- Check build logs in Cloudflare dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version matches (v22.x)

### Environment Variables Not Working
- Ensure variables are set in Cloudflare dashboard
- Re-deploy after adding new variables
- Check variable names match exactly

### AI Features Not Working
- Ensure you're deployed to Cloudflare Pages/Workers (AI binding not available locally without `wrangler dev --remote`)
- Check that `wrangler.toml` has the AI binding configured
- Review error logs in Functions tab

## Migration from Vercel

This project has been migrated from Vercel. Key changes:

1. **Adapter**: `@astrojs/vercel` → `@astrojs/cloudflare`
2. **AI Integration**: Vercel AI SDK → Cloudflare Workers AI (no API keys needed!)
3. **Environment Variables**: 
   - `VERCEL_ENV` → `CF_PAGES_BRANCH`
   - `VERCEL_URL` → `CF_PAGES_URL`
   - Removed: `GOOGLE_GENERATIVE_AI_API_KEY` (no longer needed)
4. **Analytics**: Vercel Speed Insights → Cloudflare Web Analytics
5. **AI Models**: Google Gemini → Llama 3.1 + Flux 1 (open-source, serverless)

## Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Workers AI Models Catalog](https://developers.cloudflare.com/workers-ai/models/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
