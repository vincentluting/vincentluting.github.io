// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Stories and pages keep `<!-- TODO(Vincent): ... -->` notes in their
 * Markdown source. They must never reach the published HTML, so every HTML
 * comment is removed from the built pages. scripts/check-dist.mjs then fails
 * the build if a note still slips through.
 */
/** @returns {import('astro').AstroIntegration} */
function stripHtmlComments() {
  /** @param {string} d @returns {string[]} */
  const walk = (d) =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.html') ? [join(d, e.name)] : [],
    );
  return {
    name: 'strip-html-comments',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        for (const file of walk(root)) {
          const html = readFileSync(file, 'utf8');
          const clean = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
          if (clean !== html) writeFileSync(file, clean);
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://vincentluting.github.io',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: true,
  integrations: [sitemap(), stripHtmlComments()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/notes': '/posts',
    '/tags': '/posts',
    '/tags/ai': '/posts',
    '/projects': '/stories',
    '/experience': '/about',
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
