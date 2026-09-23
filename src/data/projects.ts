import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'deep-dive',
    title: 'Deep Dive',
    kicker: 'AI career assessment platform · MBA thesis',
    period: '2025 – 2026',
    summary:
      'A career exploration platform that combines a 147-question psychometric assessment, 30 original career archetypes and AI-guided coaching. Designed, built and shipped end to end.',
    featured: true,
    metrics: [
      { value: '147', label: 'assessment questions' },
      { value: '30', label: 'original archetypes' },
      { value: '5', label: 'layer scoring pipeline' },
      { value: '76k+', label: 'lines of code' },
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Claude API', 'Vercel'],
    links: [
      { label: 'Visit deepdivecareer.com', href: 'https://www.deepdivecareer.com' },
    ],
    caseStudy: {
      problem:
        'Most career tests hand people a four-letter label and stop. Internationals in particular need something that understands cross-cultural identity, not just personality, and then actually helps them decide what to do next.',
      approach: [
        'Designed a multi-dimensional assessment framework (147 questions) covering personality, vocational interests, cognitive style and cross-cultural identity.',
        'Synthesised established instruments (Holland RIASEC, Big Five, Career Anchors, CliftonStrengths, MBTI Step II, DISC, HBDI) with original research into 30 bilingual career archetypes.',
        'Built a 5-layer scoring pipeline that turns raw responses into actionable career profiles, with quality guidelines for consistent scoring.',
        'Added an AI coaching layer grounded in each person’s own assessment results rather than generic advice.',
      ],
      outcome: [
        'Live, full-stack product at deepdivecareer.com built with Next.js, TypeScript and PostgreSQL (76,000+ lines of code).',
        'Serves as the MBA thesis for the University of Amsterdam MBA in AI, Data & Analytics.',
        'Bilingual (English and Chinese) from day one.',
      ],
    },
  },
  {
    id: 'viewer-survey-ai',
    title: 'AI-enabled viewer survey reporting',
    kicker: 'Tencent · PUBG Mobile Esports',
    period: '2025 – 2026',
    summary:
      'Replaced a manual weekly reporting routine with an AI-assisted workflow, freeing about 3 hours a week and feeding cleaner insight from 12,000+ survey responses to the Esports Data Center team.',
    stack: ['n8n', 'Claude', 'Survey data', 'Dashboards'],
  },
  {
    id: 'amc-dashboards',
    title: 'Amazon Marketing Cloud dashboards',
    kicker: 'Philips · Product Owner',
    period: '2021 – 2023',
    summary:
      'Four marketing dashboards and three new AMC platform features built with Amazon Ads and AWS, lifting campaign activation productivity by 15% and campaign performance by 10%.',
    stack: ['Amazon Marketing Cloud', 'AWS', 'SQL', 'Agile delivery'],
  },
  {
    id: 'ai-hackathon',
    title: 'AI Hackathon',
    kicker: 'Team project',
    period: 'Nov 2025 – Feb 2026',
    summary:
      'Researched leading AI products in depth and built AI-powered prototypes with a cross-functional team over a three-month hackathon.',
    stack: ['Product research', 'Prototyping', 'LLM tooling'],
  },
];

export const featuredProject = projects.find((p) => p.featured)!;
export const otherProjects = projects.filter((p) => !p.featured);
