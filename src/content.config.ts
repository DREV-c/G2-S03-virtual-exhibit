// Content-layer view of the exhibit pages, used by the group-owned homepage
// (src/components/HomepageLayoutCompat.astro) to list exhibits WITHOUT importing
// the page modules. Importing them (Astro.glob before, import.meta.glob now,
// eager or lazy) attaches each page's own CSS bundle to the homepage <head>;
// the exhibit's theme.css contains `.toc { display:none !important }`, which
// hides the homepage's exhibit list. The glob loader only parses frontmatter,
// so no page CSS leaks. See plans/homepage-astro-glob-blocker.md.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const exhibits = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/pages' }),
});

export const collections = { exhibits };
