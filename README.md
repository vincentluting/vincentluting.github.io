# vincentluting.github.io

Personal site of Ting (Vincent) Lu — project manager & product owner in the Netherlands.
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

## Editing content without code

All text on the site lives in plain YAML and Markdown files, and the repo has a
[Pages CMS](https://pagescms.org) config (`.pages.yml`). To edit through forms:

1. Go to https://app.pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub App for this repository (one-time).
3. Open the repo. You get sections for Profile & contact, About, Experience,
   Projects, Skills & numbers and Writing, plus image and CV uploads.
4. Save. Each save is a commit to `main`, and the site rebuilds in about a minute.

You can also edit the same files directly on github.com (pencil icon on a file).

## Where things live

| What | Where |
|---|---|
| Name, headline, contact links, availability / work-authorisation lines, portrait, CV | `src/data/site.yaml` |
| Work history, education, certifications | `src/data/experience.yaml` — `featured: true` and `highlightIdx` control what the home page shows |
| Projects and the Deep Dive case study | `src/data/projects.yaml` — the project with `featured: true` becomes the case study |
| Skill groups and the key-number tiles | `src/data/skills.yaml` |
| About page story and hobbies | `src/data/about.yaml` |
| Blog posts | `src/content/posts/<slug>.md` |
| Uploaded images (portrait, post covers) | `src/assets/uploads/` — referenced as `/src/assets/uploads/<file>` |
| CV PDF | `public/cv/` — referenced as `/cv/<file>.pdf` |
| Default social share image | `public/og-default.png` (1200×630) |
| Colours, fonts, dark mode tokens | `src/styles/global.css` |

The YAML files are validated at build time (`src/data/types.ts`). If a value is
missing or malformed, `npm run build` (and the GitHub Action) fails with a message
naming the file and field.

## Adding a post

In Pages CMS: Writing → Add. Or create `src/content/posts/my-slug.md`:

```md
---
title: "Post title"
description: "One or two sentences used in cards, SEO and RSS."
date: 2026-01-31
tags: ["ai"]
cover: /src/assets/uploads/posts/my-slug.webp
coverAlt: "What the image shows"
---

Body in Markdown.
```

The file name becomes the URL: `/posts/my-slug/`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site with
`withastro/action` and publishes it to GitHub Pages (source: GitHub Actions).
