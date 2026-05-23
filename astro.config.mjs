import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://domovturovice.cz',
  integrations: [mdx(), sitemap({ filter: (page) => !!page })],
  output: 'static',
  build: {
    outDir: 'dist',
  },
});
