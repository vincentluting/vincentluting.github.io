import type { ImageMetadata } from 'astro';

/**
 * Every image under src/assets/uploads/ is available here, keyed by its
 * root-relative path, e.g. "/src/assets/uploads/portrait.webp".
 * Content files (YAML and Markdown) reference images with that exact string,
 * which is what Pages CMS writes when you pick an image in the editor.
 */
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{png,jpg,jpeg,webp,avif,gif}',
  { eager: true },
);

export function resolveImage(path: string): ImageMetadata;
export function resolveImage(path: string | undefined | null): ImageMetadata | undefined;
export function resolveImage(path: string | undefined | null): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = path.startsWith('/') ? path : `/${path}`;
  const mod = images[key];
  if (!mod) {
    throw new Error(
      `Image not found: "${path}". Put the file in src/assets/uploads/ and reference it as /src/assets/uploads/<name>. Available: ${Object.keys(images).join(', ')}`,
    );
  }
  return mod.default;
}
