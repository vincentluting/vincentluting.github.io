# vincentluting.github.io

Personal site of Vincent Lu, a project manager in Utrecht focused on digital delivery and adoption. It brings together selected work, the Deep Dive thesis project, and writing about AI, work and life between China and the Netherlands.
Live at **https://vincentluting.github.io**.

Built with [Astro 7](https://astro.build), Tailwind CSS 4 and self-hosted fonts (Newsreader +
IBM Plex Mono). The design is "ink on handmade paper": a static paper grain, deckled photo edges,
a vermilion VL seal, and motion that feels like ink and paper. There is no client-side framework.
About 7 KB of JavaScript (gzipped) runs on first load; a further cinematic layer (GSAP) is
fetched afterwards, and only while motion is on:

| Effect | Where | Code |
|---|---|---|
| Ink drifting through water behind the hero (WebGL, desktop only; skipped on low-power devices, and it sleeps when off-screen or idle) | Home | `src/scripts/fluid-ink.ts`, adapted from [astro-sumi](https://github.com/kpab/astro-sumi) (MIT, © 2026 kpab) |
| A painting hidden under the paper (Huang Gongwang, public domain) that the cursor uncovers like a wet brush. It opens in the hero and in the margins beside the content, never under the text below the hero | Home | `src/components/ink/PageInk.astro`, `src/scripts/fluid-ink.ts` (mode `page`) |
| Ink-bleed title reveal, brush strokes under page titles, signature, seal stamp, scroll reveal | All pages | `src/scripts/motion.ts`, `src/styles/global.css` |
| Page transitions: the new page spreads out like ink on wet paper | All pages | CSS `@view-transition` (Chrome, Edge, Safari) |
| Headings revealed line by line, cards dropped onto the page, background parallax behind the hero, signature written as you scroll | All pages | `src/scripts/cinema.ts` ([GSAP](https://gsap.com) SplitText + ScrollTrigger) |
| Magnetic buttons and cards that tip towards the pointer (mouse only, not on reading pages) | Home, About, Stories | `src/scripts/pointer.ts` |
| Drop cap drying into ink, reading progress thread | About, stories, posts | `src/styles/global.css` (CSS only) |

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

## Design rules

A few fixed rules keep the site orderly as it grows. Follow them when you add
a page or a section.

- **One grid.** From 64rem up, every section sits on 12 columns: its label on
  the left (4 columns), its content on the right (8). Below that the label
  stacks on top. Use `GridSection` for home sections and page groups and
  `PageHeader` for page tops; the footer and the case study and post pages use
  the same `page-grid` utility. The home hero uses the same 12 columns (text 8,
  portrait 4).
- **One type scale.** Sizes come only from the tokens in
  `src/styles/global.css`: `text-meta` (12), `text-label` (13), `text-body`
  (18), `text-lead` (20), `text-title` (24), `text-h3` (30), `text-h2` (36),
  `text-h1` (48), `text-display` (72). IBM Plex Mono is for labels and meta,
  Newsreader for everything else.
- **Lines.** Dividers between sections are as wide as the content. Only the
  page frame (the bottom of the hero band, the top of the footer) runs edge to
  edge.
- **Lists, not cards, for text.** Every list row is `ListRow`: a meta line,
  the title, an optional description, and an arrow (→ on this site, ↗ to
  another site).
- **One word per thing.** The navigation word is the eyebrow of its section
  and page (Work, About, Blog, Contact). A teaser on the home page and the page
  it leads to share the same heading. Work items are called case studies. The
  home page follows the order of the navigation.
- **Ink.** The brush stroke marks page titles only, never section headings.
  Vermilion means "you can click this" or "this is me" (the name, the seal,
  the signature); labels that are not links are grey.
- **Reading.** Long text (`.prose`) keeps about 70 characters a line (38rem).

## Editing content without code

All text on the site lives in plain YAML and Markdown files, and the repo has a
[Pages CMS](https://pagescms.org) config (`.pages.yml`). To edit through forms:

1. Go to https://app.pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub App for this repository (one-time).
3. Open the repo. You get sections for Profile & contact, About page,
   Case studies, How I work, Testimonials and Blog, plus image uploads.
4. Save. Each save is a commit to `main`, and the site rebuilds in about a minute.

You can also edit the same files directly on github.com (pencil icon on a file).

## Where things live

| What | Where |
|---|---|
| Name, the short intro on the home page, contact links, portrait, Search Console code | `src/data/site.yaml` |
| Case studies (the Work page) | `src/content/stories/<slug>.md`. `order` sets the order and the first three appear on the home page |
| Things I made (Work page and the Work section of the home page) | `made` in `src/data/about.yaml` |
| Deep Dive block on the Work page | `src/components/work/DeepDive.astro`, with the demo URL in `src/data/site.yaml` |
| About page story and hobbies | `src/data/about.yaml`. `homeIntro` is the short introduction on the home page |
| Contact block (the footer of every page) | `src/components/Footer.astro` |
| Working methods draft | `src/content/pages/how-i-work.md` (unlisted at `/how-i-work/`) |
| Testimonials | `src/data/testimonials.yaml` — not shown on any page at the moment |
| Blog posts | `src/content/posts/<slug>.md` — `archive: true` lists a post under "Earlier notes" at the end of the blog page and keeps it off the home page (same URL, still in RSS) |
| Uploaded images (portrait, post covers) | `src/assets/uploads/` — referenced as `/src/assets/uploads/<file>` |
| CV PDF (optional) | `public/cv/`, referenced as `/cv/<file>.pdf` in `cvPath`. It is empty now, so the site has no CV download; the buttons come back when you set it |
| Default social share image | `public/og-default.png` (1200×630) |
| Colours, fonts, dark mode tokens | `src/styles/global.css` |

The YAML files are validated at build time (`src/data/types.ts`). If a value is
missing or malformed, `npm run build` (and the GitHub Action) fails with a message
naming the file and field.

## Adding a story

In Pages CMS: Case studies → Add. Give it a title like the start of a story ("Why vendors on Amazon waited so long for an answer"),
add a short title only if the title is longer than about 45 characters (a shorter version with the same meaning, used for the browser tab and Google), and write the body with these headings: The situation, The hard part, What I did, What came out of it, and,
only in your own words, What I would do differently. Use the public highlight fields for your specific contribution and an attributable outcome. Notes like `<!-- TODO(Vincent): ... -->` are HTML comments removed from the built site.

## Adding a post

In Pages CMS: Blog → Add. Or create `src/content/posts/my-slug.md`:

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
