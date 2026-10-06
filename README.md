# vincentluting.github.io

Personal site of Ting (Vincent) Lu in Utrecht: a few stories from work and from moving countries, notes, and what I am doing now. It is a personal website, not a CV: work history and job-search details are deliberately left out.
Live at **https://vincentluting.github.io**.

Built with [Astro 7](https://astro.build), Tailwind CSS 4 and self-hosted fonts (Newsreader +
IBM Plex Mono). The design is "ink on handmade paper": a static paper grain, deckled photo edges,
a vermilion TL seal, and motion that feels like ink and paper. There is no client-side framework.
About 7 KB of JavaScript (gzipped) runs on first load; a further cinematic layer (GSAP) is
fetched afterwards, and only while motion is on:

| Effect | Where | Code |
|---|---|---|
| Ink drifting through water behind the hero (WebGL, desktop only; skipped on low-power devices, and it sleeps when off-screen or idle) | Home | `src/scripts/fluid-ink.ts`, adapted from [astro-sumi](https://github.com/kpab/astro-sumi) (MIT, © 2026 kpab) |
| Ink-bleed title reveal, brush strokes under headings, signature, seal stamp, scroll reveal | All pages | `src/scripts/motion.ts`, `src/styles/global.css` |
| Page transitions: the new page spreads out like ink on wet paper | All pages | CSS `@view-transition` (Chrome, Edge, Safari) |
| Headings revealed line by line, cards dropped onto the page, hero parallax, signature written as you scroll, header that tucks away | All pages | `src/scripts/cinema.ts` ([GSAP](https://gsap.com) SplitText + ScrollTrigger) |
| A soft ink wash that trails the (always visible) system pointer, magnetic buttons (mouse only, not on reading pages) | Home, About, Now | `src/scripts/cursor.ts`, `src/components/InkCursor.astro` |
| Hero portrait unrolled like a hanging scroll, drop cap drying into ink, reading progress thread | Home, stories, posts | `src/styles/global.css` (CSS only) |

Everything is decoration on top of a complete page. Scrolling is native (no smooth-scroll
library), and reveal animations only hide text that is still off-screen when the script runs, so
a failed script never leaves text invisible. Print shows every page in black on white. Visitors can switch it off with the wave
button in the header (saved in their browser), and it is off by default for people whose system
asks for reduced motion. The brush strokes and signature are fixed SVG paths in
`src/lib/shapes.ts` (made once with perfect-freehand and the OFL font Mrs Saint Delafield).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/, then scripts/check-dist.mjs
npm run preview    # serve dist/ locally
npm run check      # astro check (types + template errors)
```

Requires Node 22.12+ (see `.nvmrc`).

`npm run build` removes HTML comments from the built pages and then runs
`scripts/check-dist.mjs`, which fails the build if a `TODO(Vincent)` note, a drafting remark or a
phone number reaches `dist/`. The notes stay in the Markdown source; they are never published.

## Editing content without code

All text on the site lives in plain YAML and Markdown files, and the repo has a
[Pages CMS](https://pagescms.org) config (`.pages.yml`). To edit through forms:

1. Go to https://app.pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub App for this repository (one-time).
3. Open the repo. You get sections for Profile & contact, About,
   Stories, How I work, Now, Testimonials and Writing, plus image uploads.
4. Save. Each save is a commit to `main`, and the site rebuilds in about a minute.

You can also edit the same files directly on github.com (pencil icon on a file).

## Where things live

| What | Where |
|---|---|
| Name, the short intro on the home page, contact links, portrait, Search Console code | `src/data/site.yaml` |
| Work stories (case studies), including Deep Dive | `src/content/stories/<slug>.md` — `order` sets the order; the home page lists them all as a quiet list |
| About page story and hobbies | `src/data/about.yaml` — paragraphs 1 and 4 and the hobbies also appear on the home page |
| Now page | `src/data/now.yaml` — update the date when you change it |
| How I run a project page | `src/content/pages/how-i-work.md` (URL stays `/how-i-work/`) |
| Testimonials | `src/data/testimonials.yaml` — the home page section is hidden while it is empty |
| Blog posts | `src/content/posts/<slug>.md` |
| Uploaded images (portrait, post covers) | `src/assets/uploads/` — referenced as `/src/assets/uploads/<file>` |
| CV PDF (optional) | `public/cv/`, referenced as `/cv/<file>.pdf` in `cvPath`. It is empty now, so the site has no CV download; the buttons come back when you set it |
| Default social share image | `public/og-default.png` (1200×630) |
| Colours, fonts, dark mode tokens | `src/styles/global.css` |

The YAML files are validated at build time (`src/data/types.ts`). If a value is
missing or malformed, `npm run build` (and the GitHub Action) fails with a message
naming the file and field.

## Adding a story

In Pages CMS: Stories → Add. Give it a title like the start of a story ("Why vendors on Amazon waited so long for an answer"),
add a short title (about 45 characters) for the browser tab and Google, and write the body with these headings: The situation, The hard part, What I did, What came out of it, and,
only in your own words, What I would do differently. Notes like `<!-- TODO(Vincent): ... -->` are HTML comments: they never show on the site.

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
