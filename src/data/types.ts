export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string; // "May 2025"
  end: string; // "Jun 2026" | "Present"
  summary: string;
  bullets: string[];
  /** Shown on the home page "Selected experience" section. */
  featured?: boolean;
  /** Which bullets (by index) to show on the home page. */
  highlightIdx?: number[];
  tags?: string[];
}

export interface Education {
  school: string;
  degree: string;
  field?: string;
  location: string;
  years: string;
  note?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  kicker: string;
  period: string;
  summary: string;
  featured?: boolean;
  metrics?: ProjectMetric[];
  stack?: string[];
  links?: ProjectLink[];
  caseStudy?: {
    problem: string;
    approach: string[];
    outcome: string[];
  };
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Highlight {
  value: string;
  label: string;
  sub?: string;
}
