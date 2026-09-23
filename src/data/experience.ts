import type { Experience } from './types';

export const experience: Experience[] = [
  {
    id: 'tencent-esports',
    company: 'Tencent',
    role: 'Project Manager, PUBG Mobile Esports Marketing',
    location: 'Amsterdam',
    start: 'May 2025',
    end: 'Jun 2026',
    summary:
      'Kept regional esports marketing across Europe, MENA and Asia aligned with HQ strategy, and used AI to take the manual work out of reporting.',
    bullets: [
      'Managed cross-regional coordination across Europe, MENA and Asia, keeping regional priorities aligned with HQ strategy.',
      'Built an AI-enabled workflow for viewer survey reporting, cutting manual processing by about 3 hours per week.',
      'Partnered with the Esports Data Center product manager on analysis of 12,000+ viewer survey responses to support decisions on user engagement features.',
      'Orchestrated global PUBG Mobile events, aligning diverse regional stakeholder needs with HQ strategy to grow the international player base by 3%.',
    ],
    featured: true,
    highlightIdx: [0, 1],
    tags: ['Stakeholder alignment', 'AI automation', 'Esports'],
  },
  {
    id: 'tencent-it',
    company: 'Tencent',
    role: 'Customer Relationship IT Project Manager',
    location: 'Amsterdam',
    start: 'Aug 2023',
    end: 'May 2025',
    summary:
      'Owned the IT relationship with three game studios and served as EU Product Owner for security and foundation IT products.',
    bullets: [
      'Managed customer relationships across three game studios, promoting tailored IT solutions that achieved $91,000 in annual cost savings.',
      'Led IT PMO initiatives across 3 regions (EMEA, Asia, US), improving operational efficiency and standardising how studios adopt new technologies.',
      'Served as EU Product Owner for Security and Foundation IT products, aligning EMEA, Asia and US roadmaps with studio business needs.',
      'Worked with HR and Finance on onboarding processes, acting as the operational bridge between IT systems and people workflows.',
      'Coached 2 junior IT specialists and 4 interns with structured development plans and regular feedback.',
    ],
    featured: true,
    highlightIdx: [0, 2],
    tags: ['IT PMO', 'Product ownership', 'Coaching'],
  },
  {
    id: 'philips',
    company: 'Philips',
    role: 'Product Owner, Amazon Ads Dashboards',
    location: 'Amsterdam',
    start: 'Nov 2021',
    end: 'Aug 2023',
    summary:
      'Turned Amazon Marketing Cloud data into dashboards and features the media teams actually used.',
    bullets: [
      'Designed and implemented 4 marketing dashboards with engineers, boosting campaign activation productivity by 15%.',
      'Delivered insights on audience segmentation and optimal ad frequency from Amazon Marketing Cloud data, contributing to a 10% uplift in campaign performance.',
      'Collaborated with Amazon Ads and AWS to design and launch 3 new product features for the Amazon Marketing Cloud platform.',
      'Partnered with media and analytics teams to improve campaign targeting and ROI.',
    ],
    featured: true,
    highlightIdx: [0, 2],
    tags: ['Dashboards', 'Amazon Marketing Cloud', 'Product ownership'],
  },
  {
    id: 'amazon',
    company: 'Amazon',
    role: 'Vendor Service Consultant',
    location: 'The Hague',
    start: 'Jul 2019',
    end: 'Nov 2021',
    summary:
      'Helped launch Amazon.nl and automated the vendor operations behind it.',
    bullets: [
      'Led 2 cross-regional automation projects, achieving efficiency savings equivalent to 1.8 full-time headcounts.',
      'Facilitated the launch of Amazon’s Dutch marketplace by developing 2 new web tools and SOPs to optimise product selection and defect elimination.',
      'Built 3 Amazon QuickSight dashboards, improving e-commerce data quality by 30% and reducing reporting errors by 25%.',
      'Advised 10+ e-commerce vendors on growth strategies using data-driven insights.',
      'Trained and mentored 10+ new hires and 3 internal teams on technical learning and development.',
    ],
    featured: true,
    highlightIdx: [1, 0],
    tags: ['Automation', 'Marketplace launch', 'QuickSight'],
  },
  {
    id: 'huawei',
    company: 'Huawei Technologies B.V.',
    role: 'Marketing Financial Controller',
    location: 'The Hague',
    start: 'Feb 2018',
    end: 'Jun 2019',
    summary:
      'Controlled a $30M+ European marketing budget and built the tooling to forecast it properly.',
    bullets: [
      'Coordinated marketing and retail campaigns with budgets exceeding $30M across cross-functional teams.',
      'Increased budget forecasting accuracy from 82% to 96% by developing an automation tool for campaign ROI analysis.',
      'Evaluated campaign performance to improve online and offline visibility, achieving a 15% increase in post-campaign engagement.',
      'Provided quarterly budget allocation reports to C-level executives.',
    ],
    tags: ['Budget control', 'ROI analysis', 'Campaign coordination'],
  },
  {
    id: 'caca',
    company: 'CaCa Media B.V.',
    role: 'Public Relations Intern',
    location: 'Amsterdam',
    start: 'Jun 2017',
    end: 'Nov 2017',
    summary: 'PR and business development for a Chinese company expanding into Europe.',
    bullets: [
      'Coordinated PR and business development for a Chinese company expanding overseas, raising brand awareness and identifying 5 new business opportunities across Europe.',
    ],
    tags: ['PR', 'Business development'],
  },
];

export const featuredExperience = experience.filter((e) => e.featured);
