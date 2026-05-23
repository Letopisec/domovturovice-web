import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titulek: z.string(),
    datum: z.coerce.date(),
    kategorie: z.string(),
    perex: z.string(),
    nahledovyObrazek: z.string().optional(),
  }),
});

export const collections = { blog };
