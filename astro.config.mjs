import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://domovturovice-web.pages.dev',
  integrations: [mdx()],
  output: 'static',
  build: {
    outDir: 'dist',
  },
});
