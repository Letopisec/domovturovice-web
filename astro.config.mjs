import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://domovturovice-web.pages.dev',
  integrations: [mdx(), sitemap({ customPages: [] })],
  output: 'static',
  build: {
    outDir: 'dist',
  },
});
