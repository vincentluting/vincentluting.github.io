import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'stories'>;

/** Published stories in reading order. */
export async function getStories(): Promise<Story[]> {
  return (await getCollection('stories', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/** Unique view-transition name so a card title can morph into the story's h1. */
export const storyTransition = (id: string) => `story-${id.replace(/[^a-z0-9-]/gi, '-')}`;
