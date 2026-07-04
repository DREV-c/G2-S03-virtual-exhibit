import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import icon from 'astro-icon';

export default defineConfig({
  // react() before mdx() so the React JSX runtime governs component transforms.
  integrations: [react(), mdx(), icon()],
  site: 'https://jrgo7.github.io',
  base: 'virtual-exhibit-template',
});

