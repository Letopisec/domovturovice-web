// ════════════════════════════════════════════════════════════════
// SITE.TS — CENTRÁLNÍ KONFIGURACE PROJEKTU
// Název, kontakty, adresa na JEDNOM místě.
// Importuje se do Header, Footer, Schema, kontaktní stránky.
// Změna kontaktu = úprava jen zde, ne v 20 souborech.
// ════════════════════════════════════════════════════════════════

export const SITE = {
  // Identita
  name: 'Název firmy',              // TODO
  legalName: 'Název firmy s.r.o.',  // TODO – plný právní název
  tagline: 'krátký podtitul',       // TODO – pod logem v hlavičce
  url: 'https://PRODUKCNI-DOMENA.cz', // TODO – musí sedět s astro.config.mjs

  // Kontakt
  phone: '+420 000 000 000',        // TODO
  phoneHref: '+420000000000',       // TODO – bez mezer, pro tel:
  email: 'info@domena.cz',          // TODO
  address: {
    street: 'Ulice 000',            // TODO
    city: 'Město',                  // TODO
    zip: '000 00',                  // TODO
    region: 'Kraj',                 // TODO – pro lokální SEO
  },

  // Sociální sítě (prázdné = nezobrazí se)
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    x: '',
  },

  // Právní / identifikační údaje (prázdné = nezobrazí se)
  // address výše = PROVOZOVNA (zobrazuje se + jde do Schema).
  // registeredAddress = SÍDLO, vyplnit JEN když se liší od provozovny.
  legal: {
    ico: '',              // TODO – IČO
    dic: '',              // TODO – jen plátce DPH, jinak prázdné
    legalForm: '',        // TODO – OSVČ | s.r.o. | a.s.
    registration: '',     // TODO – zápis v OR (soud, oddíl, vložka); OSVČ prázdné
    dataBox: '',          // datová schránka (ID), volitelné
    representative: '',   // jednatel / odpovědná osoba, volitelné
    registeredAddress: '',// sídlo – jen když jiné než provozovna
  },

  // Schema.org typ businessu
  // LocalBusiness | HVACBusiness | HomeAndConstructionBusiness | atd.
  schemaType: 'LocalBusiness',      // TODO
} as const;
