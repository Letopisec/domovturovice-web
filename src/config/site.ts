// ════════════════════════════════════════════════════════════════
// SITE.TS — CENTRÁLNÍ KONFIGURACE PROJEKTU
// Název, kontakty, adresa na JEDNOM místě.
// Importuje se do Header, Footer, Schema, kontaktní stránky.
// Změna kontaktu = úprava jen zde, ne v 20 souborech.
// ════════════════════════════════════════════════════════════════

export const SITE = {
  // Identita
  name: 'Domov Turovice',
  legalName: 'Domov Turovice, z.ú.',
  tagline: 'Domov pro seniory s úctou a respektem',  // TODO ověřit s klientem
  url: 'https://domovturovice.cz',

  // Kontakt
  phone: '+420 724 211 589',          // mobilní telefon ředitelky
  phoneHref: '+420724211589',
  phoneAlt: '+420 588 003 888',       // pevná linka
  phoneAltHref: '+420588003888',
  email: 'info@domovturovice.cz',
  emailDirector: 'reditelka@domovturovice.cz',

  address: {
    street: 'Turovice 104',
    city: 'Turovice',
    zip: '751 14',
    region: 'Olomoucký kraj',
  },

  // Sociální sítě (prázdné = nezobrazí se)
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    x: '',
  },

  // Právní / identifikační údaje
  legal: {
    ico: '06332307',
    dic: '',
    legalForm: 'zapsaný ústav (z.ú.) dle § 402 zákona č. 89/2012 Sb.',
    registration: '',     // TODO – doplnit zápis v rejstříku pokud znám
    dataBox: '',          // TODO – doplnit datovou schránku
    representative: '',   // TODO – jméno ředitelky
    registeredAddress: '',
  },

  // Schema.org typ — NursingHome je přesnější pro domov pro seniory
  schemaType: 'NursingHome',
} as const;
