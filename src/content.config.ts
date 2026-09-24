import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

/**
 * Work stories: the long version of what a CV line can only hint at.
 * The title states the outcome; the TL;DR box is what a recruiter reads first.
 */
const stories = defineCollection({
  loader: glob({ base: './src/content/stories', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    company: z.string(),
    role: z.string(),
    period: z.string(),
    // Pages CMS may write an empty value; treat it as "at the end".
    order: z.number().nullish().transform((v) => v ?? 99),
    draft: z.boolean().default(false),
    /** id of the matching job in src/data/experience.yaml, if any */
    job: z.string().nullish(),
    tldr: z.object({
      context: z.string(),
      myRole: z.string(),
      team: z.string().nullish(),
      stakeholders: z.string().nullish(),
      numbers: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      skills: z.array(z.string()).default([]),
    }),
    links: z.array(z.object({ label: z.string(), href: z.string() })).nullish().transform((v) => v ?? []),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

/** Stand-alone text pages such as How I work. */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { posts, stories, pages };
