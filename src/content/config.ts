import { defineCollection, z } from 'astro:content';

// Schéma článků – musí odpovídat polím v public/admin/config.yml
const clanky = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    category: z.string(),          // jedna kategorie (rozcestník)
    tags: z.array(z.string()).default([]),  // štítky (rozcestníky)
    cover: z.string().optional(),
    excerpt: z.string(),
    author: z.string().default('Redakce'),
    metaDescription: z.string().optional(),
  }),
});

export const collections = { clanky };
