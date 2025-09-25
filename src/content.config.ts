import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import yaml from 'js-yaml';

const CONTENT_BASE = 'src/content';

const experiences = defineCollection({
  loader: file('src/content/experiences.yaml', { parser: (content) => {
    return yaml.load(content) as Record<string, unknown>[]
  }}),
  schema: z.object({
    id: z.number(),
    year: z.number(),
    comments: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: 'projects/*.md', base: CONTENT_BASE }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string(),
    active: z.boolean().optional(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    repoUrl: z.string().url(),
    liveUrl: z.string(),
    menuLabel: z.string(),
  }).transform(data => ({ ...data, slug: data.menuLabel.toLowerCase().replace(' ', '-') })),
});

export const collections = { experiences, projects };
