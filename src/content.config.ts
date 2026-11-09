import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    items: z.array(z.tuple([z.string(), z.number()])).optional(),
    type: z.enum(['post', 'game']).default('post'),
    embed: z.string().optional(),
  }),
});

export const collections = { posts };
