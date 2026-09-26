# vincentluting.github.io

Personal site of Ting (Vincent) Lu — project manager & product owner in the Netherlands.
Live at **https://vincentluting.github.io**.

Built with [Astro 7](https://astro.build), Tailwind CSS 4 and self-hosted fonts (Newsreader +
IBM Plex Mono). The design is "ink on handmade paper": a static paper grain, deckled photo edges,
a vermilion TL seal, and motion that feels like ink and paper. There is no client-side framework.
About 7 KB of JavaScript (gzipped) runs on first load; a further ~53 KB cinematic layer
(GSAP + Lenis) is fetched afterwards, and only while motion is on:

| Effect | Where | Code |
|---|---|---|
| Ink drifting through water behind the hero (WebGL, desktop only) | Home | `src/scripts/fluid-ink.ts`, adapted from [astro-sumi](https://github.com/kpab/astro-sumi) (MIT, © 2026 kpab) |
| Ink-bleed title reveal, brush strokes under headings, signature, seal stamp, scroll reveal | All pages | `src/scripts/motion.ts`, `src/styles/global.css` |
| Hand-drawn circles around key numbers | Stories | `src/scripts/annotate.ts` ([rough-notation](https://roughnotation.com), MIT) |
| Page transitions: the new page spreads out like ink on wet paper | All pages | CSS `@view-transition` (Chrome, Edge, Safari) |
| Smooth scrolling, headings revealed line by line, cards dropped onto the page, hero parallax, signature written as you scroll, header that tucks away | All pages | `src/scripts/cinema.ts` ([GSAP](https://gsap.com) SplitText + ScrollTrigger, [Lenis](https://lenis.dev)) |
| Ink cursor, magnetic buttons, cards that tip towards the pointer (mouse only) | All pages | `src/scripts/cursor.ts`, `src/components/InkCursor.astro` |
| Hero portrait unrolled like a hanging scroll, drop cap drying into ink, reading progress thread | Home, stories, posts | `src/styles/global.css` (CSS only) |

Everything is decoration on top of a complete page. Visitors can switch it off with the wave
button in the header (saved in their browser), and it is off by default for people whose system
asks for reduced motion. The brush strokes and signature are fixed SVG paths in
`src/lib/shapes.ts` (made once with perfect-freehand and the OFL font Mrs Saint Delafield).

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
   Stories, How I work, Now, Testimonials, Skills & numbers and Writing, plus image and
   CV uploads.
4. Save. Each save is a commit to `main`, and the site rebuilds in about a minute.

You can also edit the same files directly on github.com (pencil icon on a file).

## Where things live

| What | Where |
|---|---|
| Name, headline, contact links, availability / work-authorisation lines, portrait, CV | `src/data/site.yaml` |
| Work stories (case studies), including Deep Dive | `src/content/stories/<slug>.md` — `order` sets the order; the first 4 are on the home page |
| Work history, education, certifications | `src/data/experience.yaml` — the short CV-style version on `/experience/` |
| Skill groups and the key-number tiles | `src/data/skills.yaml` (shown on `/experience/`) |
| About page story and hobbies | `src/data/about.yaml` — paragraphs 1, 3 and 5 also appear on the home page |
| Now page | `src/data/now.yaml` — update the date when you change it |
| How I work page | `src/content/pages/how-i-work.md` |
| Testimonials | `src/data/testimonials.yaml` — the home page section is hidden while it is empty |
| Blog posts | `src/content/posts/<slug>.md` |
| Uploaded images (portrait, post covers) | `src/assets/uploads/` — referenced as `/src/assets/uploads/<file>` |
| CV PDF | `public/cv/` — referenced as `/cv/<file>.pdf` |
| Default social share image | `public/og-default.png` (1200×630) |
| Colours, fonts, dark mode tokens | `src/styles/global.css` |

The YAML files are validated at build time (`src/data/types.ts`). If a value is
missing or malformed, `npm run build` (and the GitHub Action) fails with a message
naming the file and field.

## Adding a story

In Pages CMS: Stories → Add. Start the title with the result ("Cutting X from 18 days to 8"),
fill the "In short" box (the first number gets a hand-drawn circle), and write the body with
these headings: The situation, The hard part, What I did, What came out of it, What I would do
differently. Set `job` to the matching ID in `experience.yaml` to link it from the Experience page.
Notes like `<!-- TODO(Vincent): ... -->` are HTML comments: they never show on the site.

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
