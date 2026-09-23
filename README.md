# vincentluting.github.io

Personal site of Ting (Vincent) Lu — project & product manager in the Netherlands.
Live at **https://vincentluting.github.io**.

Built with [Astro 7](https://astro.build), Tailwind CSS 4 and self-hosted fonts (Fraunces + Inter).
No client-side framework; the only JavaScript is the theme toggle, the mobile menu and a small
scroll-reveal script.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
npm run check      # astro check (types + template errors)
```

Requires Node 22.12+ (see `.nvmrc`).

## Where things live

| What | Where |
|---|---|
| Name, headline, contact links, availability line | `src/data/site.ts` |
| Work history (timeline + home "Selected experience") | `src/data/experience.ts` — set `featured: true` and `highlightIdx` to control what the home page shows |
| Education / certifications | `src/data/education.ts`, `src/data/certifications.ts` |
| Projects and the Deep Dive case study | `src/data/projects.ts` |
| Skill groups | `src/data/skills.ts` |
| Stat tiles on the home page | `src/data/highlights.ts` |
| About page copy and hobbies | `src/data/about.ts` |
| Blog posts | `src/content/posts/<slug>/index.md` (+ `cover.*` next to it) |
| Portrait photo | `src/assets/portrait.webp` — replace the file, keep the name |
| CV PDF | `public/cv/Ting-Lu-CV.pdf` — replace the file, keep the name |
| Default social share image | `public/og-default.png` (1200×630) |
| Colours, fonts, dark mode tokens | `src/styles/global.css` |

## Adding a post

Create `src/content/posts/my-slug/index.md`:

```md
---
title: "Post title"
description: "One or two sentences used in cards, SEO and RSS."
date: 2026-01-31
tags: ["ai"]
cover: "./cover.webp"
coverAlt: "What the image shows"
---

Body in Markdown.
```

The folder name becomes the URL: `/posts/my-slug/`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site with
`withastro/action` and publishes it to GitHub Pages (source: GitHub Actions).
