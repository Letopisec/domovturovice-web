import { defineCollection, z } from 'astro:content';

// Schéma článků – česká pole, musí odpovídat polím v public/admin/config.yml
// a renderování v [slug].astro a aktuality.astro.
const clanky = defineCollection({
  type: 'content',
  schema: z.object({
    titulek: z.string(),
    datum: z.coerce.date(),                 // string v .md → Date v kódu (řazení + formátování)
    kategorie: z.string(),                  // jedna kategorie (rozcestník), volný text
    stitky: z.array(z.string()).default([]),// štítky (rozcestníky), volný text
    nahled: z.string().optional(),          // cesta k úvodní fotce
    perex: z.string(),                      // krátký úvod do náhledu
    autor: z.string().default('Domov Turovice'),
    popis: z.string().optional(),           // SEO meta description
  }),
});

export const collections = { clanky };
