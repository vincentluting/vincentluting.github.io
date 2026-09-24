// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vincentluting.github.io',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: true,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/notes': '/posts',
    '/tags': '/posts',
    '/tags/ai': '/posts',
    '/projects': '/stories',
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
