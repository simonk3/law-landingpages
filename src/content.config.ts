import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog posts were served from Prismic until the CMS was dropped. The slugs here are
 * the live URLs and the 301 targets in vercel.json, so a filename is not free to
 * change: renaming one breaks an indexed URL and the redirect pointing at it.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Falls back to pubDate in the template when a post has never been edited.
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string(),
    heroAlt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
