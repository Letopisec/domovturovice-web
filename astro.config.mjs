import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import legalCheck from './integrations/legal-check.mjs';

// ⚠️ KRITICKÉ (poučení z Domov Turovice):
// site MUSÍ být produkční doména, NIKDY pages.dev.
// Špatná hodnota = špatné canonical URL + Cloudflare cache problém "Uploaded 0 files".
// → Při zakládání nového webu zde nastav reálnou produkční doménu.
const SITE_URL = 'https://PRODUKCNI-DOMENA.cz';

// Sitemap se zapne automaticky, jakmile je nastavena reálná doména
// (s placeholderem by build spadl).
const isRealDomain = !SITE_URL.includes('PRODUKCNI-DOMENA');

export default defineConfig({
  site: SITE_URL,
  // legalCheck() běží VŽDY (i s placeholder doménou) — právní kontrola musí jet pořád.
  // sitemap zůstává podmíněný reálnou doménou.
  integrations: [legalCheck(), ...(isRealDomain ? [sitemap()] : [])],
});
