# astro-web-starter

Univerzalni Astro starter pro rychlou tvorbu webu. Komponentovy system,
oddelena theme vrstva, deployment ready pro Cloudflare Pages.

Tento repozitar je **GitHub Template** - novy web vznika pres "Use this template",
ne klonovanim. Kazdy web je pak nezavisla kopie (zmeny se nepropisuji mezi weby).

---

## Co je kde

```
src/
  config/site.ts        <- nazev, kontakty, adresa, Schema typ (1 soubor)
  styles/tokens.css     <- BARVY + FONTY projektu (jedine misto pro theme)
  styles/global.css     <- systemove styly komponent (nemenit per projekt)
  layouts/Layout.astro  <- meta, canonical, importy, padding pod nav
  components/
    Header.astro        <- menu se definuje uvnitr, cte ze site.ts
    Footer.astro        <- sloupce uvnitr, cte ze site.ts
    blocks/             <- stavebni komponenty stranek (viz katalog nize)
  pages/                <- jednotlive stranky (skladaji se z bloku)
public/
  images/               <- logo.svg a fotky
  robots.txt
astro.config.mjs        <- site = produkcni domena (NIKDY pages.dev)
```

---

## Katalog komponent (bloky)

| Komponenta | K cemu | Hlavni props |
|---|---|---|
| PageHero | tmavy hero podstranky | kicker, h1, perex, buttons[] |
| StatStrip | pruh cisel pod hero | stats[] (number, label) |
| CardGrid | mrizka karet s ikonou | heading, columns, cards[] (icon, title, text, accent) |
| SplitSection | text + obrazek vedle sebe | kicker, heading, paragraphs[], reverse |
| Steps | cislovane kroky procesu | heading, steps[] (title, text) |
| Highlight | zvyrazneny citat | quote, author, role |
| CTASection | zaverecna vyzva | heading, text, buttons[] |
| RelatedCards | 4 karty "co dal" | kicker, heading, cards[] |
| ServiceCards | karty sluzeb ve 4 designech (1 jednoduche karty, 2 horizontalni s CTA + rohovy akcent, 3 rozliti barvy z rohu na hover, 4 kombinace D2+D3 s bilym CTA) | design 1-4, kicker, heading, lead, columns, bg, items[] (title, text, icon, link?, cta?) |

Akcenty karet: accent: 'green' | 'orange' | 'blue' (jinak primarni barva).
Katalog se rozrusta podle potreby - nova komponenta = pridat do blocks/.

---

## ZALOZENI NOVEHO WEBU - checklist

### Den 1 - setup (cca 30 min)
- [ ] "Use this template" -> novy repozitar
- [ ] astro.config.mjs -> SITE_URL = produkcni domena
- [ ] src/config/site.ts -> vyplnit vsechna TODO (nazev, kontakty, adresa, Schema typ)
- [ ] src/styles/tokens.css -> nastavit --clr-primary (+ hover, soft) a fonty
- [ ] Layout.astro -> upravit fontsHref podle zvolenych fontu
- [ ] public/images/logo.svg -> vlozit logo
- [ ] public/robots.txt -> doplnit domenu do Sitemap radku
- [ ] Cloudflare Pages: pripojit repo, NODE_VERSION = 20, build "npm run build", output "dist"

### Pred kazdym commitem
- [ ] title zacina hlavnim KW, description max 155 znaku + CTA
- [ ] KW prirozene v H1, H2, tele (ne spam)
- [ ] Kontextove odkazy v textu (ne jen related karty)
- [ ] Related karty -> jen existujici stranky
- [ ] Zadny AI-sounding text
- [ ] Lokalni build bez chyb (npm run build)
- [ ] canonical = produkcni domena

---

## Pouceni z Domov Turovice (zabudovano v sablone)

- **site = produkcni domena, nikdy pages.dev** -> jinak spatny canonical
  a Cloudflare hlasi "Uploaded 0 files" (cache hit, obsah se nenasadi).
- **CSS jen pres promenne z tokens.css** -> zadne hardcoded barvy/px.
- **global.css vlastni .nav vysku** -> Header ji neprepisuje (zdroj konfliktu).
- **main ma padding-top: var(--nav-height)** -> hero nepridava vlastni offset.
- **NODE_VERSION 20** v Cloudflare Pages (ne 18).

---

## Workflow tvorby stranek (s Claude)

1. Zadas stranku -> Claude navrhne strukturu (nadpisy + co je pod nimi)
2. Schvalis / upravis
3. Claude posklada stranku z bloku (ty komponenty neresis)
4. Lokalni build -> commit -> push -> Cloudflare deploy
5. Na konci: vypis pouzitych KW s hledanosti + commit hash

Poradi: homepage -> seznam prioritnich stranek -> jedna stranka -> tve potvrzeni -> dalsi.
