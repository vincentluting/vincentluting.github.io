import { z } from 'astro/zod';

const str = z.string().trim();
const optStr = str.optional().or(z.literal('').transform(() => undefined));

export const SiteSchema = z.object({
  name: str,
  preferredName: str,
  fullName: str,
  role: str,
  tagline: str,
  headline: str,
  location: str,
  email: str,
  linkedin: z.url(),
  github: z.url().optional().or(z.literal('').transform(() => undefined)),
  deepDive: z.url(),
  cvPath: z.string().default(''),
  portrait: str,
  url: z.url(),
  description: str,
  languages: z.array(z.object({ name: str, level: str, short: optStr })).default([]),
  googleSiteVerification: z.string().default(''),
});

/** Something I made, with a link to it or to the story about it. */
export const MadeSchema = z.object({ name: str, what: str, href: str });

export const AboutSchema = z.object({
  intro: z.array(str).default([]),
  hobbies: z.array(str).default([]),
  made: z.array(MadeSchema).nullish().transform((v) => v ?? []),
});

export const TestimonialSchema = z.object({
  quote: str,
  name: str,
  title: str,
  company: optStr,
  relation: optStr,
  link: optStr,
});
export const TestimonialsFileSchema = z.object({ items: z.array(TestimonialSchema).nullish().transform((v) => v ?? []) });

export type Site = z.infer<typeof SiteSchema>;
export type About = z.infer<typeof AboutSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
