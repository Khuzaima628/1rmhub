// Content collections (Astro 5 Content Layer). Guides live as .mdx files in
// src/content/guides/ and must carry this frontmatter. A missing title or a
// malformed date fails the build loudly instead of publishing a broken page.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().max(60),
    /** Short name for breadcrumbs, nav and cards. */
    shortTitle: z.string(),
    description: z.string().max(160),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** Source ids from src/data/sources.ts, listed at the end of the article. */
    sources: z.array(z.string()).default([]),
    /** Related-link keys from src/data/links.ts. */
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { guides };
