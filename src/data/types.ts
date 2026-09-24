import { z } from 'astro/zod';

const str = z.string().trim();
const optStr = str.optional().or(z.literal('').transform(() => undefined));

export const ExperienceSchema = z.object({
  id: str,
  company: str,
  role: str,
  location: str,
  start: str,
  end: str,
  summary: str,
  bullets: z.array(str).default([]),
  featured: z.boolean().default(false),
  highlightIdx: z.array(z.number().int().nonnegative()).optional(),
  tags: z.array(str).optional(),
});

export const EducationSchema = z.object({
  school: str,
  degree: str,
  field: optStr,
  location: str,
  years: str,
  note: optStr,
});

export const CertificationSchema = z.object({
  name: str,
  issuer: str,
  year: optStr,
});

export const SkillGroupSchema = z.object({ title: str, items: z.array(str).default([]) });
export const HighlightSchema = z.object({ value: str, label: str, sub: optStr });

export const SiteSchema = z.object({
  name: str,
  preferredName: str,
  fullName: str,
  role: str,
  tagline: str,
  headline: str,
  lead: str,
  location: str,
  workAuthorization: z.string().default(''),
  availability: z.string().default(''),
  lookingFor: z
    .object({
      intro: z.string().default(''),
      roles: z.array(str).default([]),
      sectors: z.array(str).default([]),
      region: z.string().default(''),
    })
    .optional(),
  email: str,
  linkedin: z.url(),
  deepDive: z.url(),
  cvPath: z.string().default(''),
  portrait: str,
  url: z.url(),
  description: str,
  languages: z.array(z.object({ name: str, level: str })).default([]),
  companies: z.array(str).default([]),
});

export const AboutSchema = z.object({
  intro: z.array(str).default([]),
  hobbies: z.array(str).default([]),
});

export const NowSchema = z.object({
  updated: z.coerce.date(),
  intro: z.string().default(''),
  sections: z.array(z.object({ title: str, items: z.array(str).default([]) })).default([]),
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

export const ExperienceFileSchema = z.object({
  jobs: z.array(ExperienceSchema),
  education: z.array(EducationSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
});
export const SkillsFileSchema = z.object({
  groups: z.array(SkillGroupSchema).default([]),
  highlights: z.array(HighlightSchema).default([]),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Highlight = z.infer<typeof HighlightSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type About = z.infer<typeof AboutSchema>;
export type Now = z.infer<typeof NowSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
