/**
 * All site content lives in the YAML files next to this module. They are
 * editable without touching code (directly on GitHub or through Pages CMS,
 * see .pages.yml). This module parses and validates them at build time so a
 * typo in the YAML fails the build with a readable message instead of
 * producing a broken page.
 */
import YAML from 'yaml';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { z } from 'astro/zod';
import siteRaw from './site.yaml?raw';
import aboutRaw from './about.yaml?raw';
import experienceRaw from './experience.yaml?raw';
import projectsRaw from './projects.yaml?raw';
import skillsRaw from './skills.yaml?raw';
import {
  AboutSchema,
  ExperienceFileSchema,
  ProjectsFileSchema,
  SiteSchema,
  SkillsFileSchema,
} from './types';

function load<T extends z.ZodTypeAny>(file: string, schema: T, raw: string): z.infer<T> {
  let data: unknown;
  try {
    data = YAML.parse(raw);
  } catch (e) {
    throw new Error(`src/data/${file} is not valid YAML: ${(e as Error).message}`);
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`src/data/${file} has invalid content:\n${issues}`);
  }
  return result.data;
}

export const site = load('site.yaml', SiteSchema, siteRaw);

/** URL of the CV PDF, or undefined when the file is not in public/ (buttons are then hidden). */
export const cvUrl: string | undefined = (() => {
  const path = site.cvPath?.trim();
  if (!path) return undefined;
  const onDisk = join(process.cwd(), 'public', path.replace(/^\//, ''));
  if (!existsSync(onDisk)) {
    console.warn(`[site] CV not found at public${path}; hiding the Download CV buttons.`);
    return undefined;
  }
  return encodeURI(path);
})();
export const about = load('about.yaml', AboutSchema, aboutRaw);

const experienceFile = load('experience.yaml', ExperienceFileSchema, experienceRaw);
export const experience = experienceFile.jobs;
export const education = experienceFile.education;
export const certifications = experienceFile.certifications;
export const featuredExperience = experience.filter((e) => e.featured);

const projectsFile = load('projects.yaml', ProjectsFileSchema, projectsRaw);
export const projects = projectsFile.projects;
export const featuredProject = projects.find((p) => p.featured) ?? projects[0];
export const otherProjects = projects.filter((p) => p !== featuredProject);

const skillsFile = load('skills.yaml', SkillsFileSchema, skillsRaw);
export const skills = skillsFile.groups;
export const highlights = skillsFile.highlights;

export type * from './types';
