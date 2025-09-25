import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CONTENT_BASE = 'src/content';

const experiences = defineCollection({
  loader: glob({ pattern: "/experiences/*.md", base: CONTENT_BASE }),
  schema: z.object({
    year: z.number(),
    comments: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: 'projects/**/index.md', base: CONTENT_BASE }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string(),
    active: z.boolean(),
    pubDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().optional(),
    menuLabel: z.string().optional(),
  }),
});

export const collections = { experiences, projects };
