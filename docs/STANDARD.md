# STANDARD PROJEKTU — zavazny zdroj pravdy

Tento dokument plati pro KAZDY web postaveny z tohoto starteru.
Pri konfliktu s cimkoli jinym plati tento dokument.

## 1. Zdroje, kterymi se ridit
- `docs/WEB_BEST_PRACTICES.md` — delky vet/odstavcu, nadpisova hierarchie,
  kontrast, CTA, struktura stranky. ZAVAZNE pro VESKERY obsah.
- `README.md` — katalog komponent + checklist + pouceni.
- `src/styles/tokens.css` — barvy a fonty projektu.
- `src/config/site.ts` — nazev, kontakty, adresa, social, legal.

## 2. SEO — povinne na KAZDE strance
- `title` zacina hlavnim KW, max ~60 znaku.
- `description` konkretni prinos + CTA, max 155 znaku.
- `schema` prop predan do Layoutu (Organization se pridava automaticky).
  Typy: WebSite/Service/FAQPage/Article/ContactPage/Product dle stranky.
- canonical = produkcni domena (resi Layout automaticky).
- KW prirozene v H1, H2, tele. Kontextove odkazy v textu.
- KW format pri vypisu: `[klicove slovo] – [hledanost]/mes`.

## 3. Obsah
- Lidsky, primy, konkretni ton. Kratke vety. Odstavce dle BEST_PRACTICES.
- Zadny AI-sounding text, zadny korporatni jazyk, zadne anglicismy.
- Ton komunikace konkretniho projektu viz SETUP.md daneho webu.

## 4. Komponenty
- Stranky se skladaji z bloku v `src/components/blocks/`.
- Chybi-li blok pro nejakou sekci, vytvorit novy do blocks/ a pridat
  do katalogu v README.
- Akcenty karet dle semantiky (1 barva = 1 vyznam).

## 5. Workflow tvorby stranky
1. Navrh struktury (nadpisy + co je pod nimi) → CEKAT na schvaleni.
2. Po schvaleni slozit stranku z bloku.
3. Lokalni build (`npm run build`) — bez chyb.
4. Commit + push → deploy.
5. Na konci vypsat KW s hledanosti + commit hash.

Poradi celeho webu: homepage → seznam prioritnich stranek →
jedna stranka → potvrzeni → dalsi.

### Fáze skeletonu — povinné právní podstránky
Už VE FÁZI SKELETONU (ne dodatečně na konci) se podle `src/config/client-profile.ts`
založí povinné právní podstránky — samostatné `.astro` v `src/pages/` pod plochými
názvy: `obchodni-podminky`, `zasady-ochrany-osobnich-udaju`, `odstoupeni-od-smlouvy`,
`zasady-pouzivani-cookies`. Které z nich vznikají, určuje profil (prodej → VOP +
odstoupení; formulář → zásady OÚ; cookies → zásady cookies). Každá nese v těle
`<LegalPageNotice>` (upozornění „text dodá klient"), dokud klient nedodá text;
neblokující build kontrola hlásí nedoplněné stránky. Pravidla: docs/PRAVNI_CHECKLIST.md.

## 6. Pouceni (zabudovano)
- `site` = produkcni domena, nikdy pages.dev.
- CSS jen pres promenne z tokens.css.
- NODE_VERSION 20 v Cloudflare Pages.
- Tokeny (GitHub/Cloudflare) nacitat z Drive, nikdy z pameti.

## 7. PLOCHÁ URL STRUKTURA (závazné pro všechny weby)
Všechny weby jsou informační (typ "Domov Turovice"), NIKDY e-shop.
Proto platí plochá struktura bez výjimky:

- Stránky, příspěvky, rozcestníky kategorií i štítků = VŽDY `domena.cz/nazev`.
- ŽÁDNÉ prefixy (`/poradna/`, `/clanky/`, `/blog/`).
- ŽÁDNÉ víceúrovňové cesty (`/kategorie/stitek/nazev`).
- ŽÁDNÉ breadcrumbs (cesta nahoře jako v e-shopech).

Kategorie a štítky:
- Každá kategorie i štítek = samostatná plochá stránka-rozcestník
  (`domena.cz/dotace`), která vypisuje články dané kategorie/štítku.
- U článku je název kategorie i štítků KLIKACÍ → vede na rozcestník
  (jako ve WordPressu). Umístění: u data/autora, v sidebaru nebo pod článkem.

Technické řešení (v starteru):
- Jedna dynamická routa `src/pages/[slug].astro` rozlišuje 3 typy:
  článek / kategorie / štítek. Vše na kořeni.
- `src/utils/slug.ts` převádí české názvy na slug (diakritika → ASCII).
- Routa obsahuje KONTROLU KOLIZÍ: build spadne, pokud se dva slugy kryjí.

PRAVIDLO PROTI KOLIZÍM:
- Před vytvořením článku/stránky/kategorie ověřit, že slug ještě neexistuje.
- Důvod ploché struktury: snadné přejmenování bez rozbití URL.
  (Změna kategorie u víceúrovňové struktury vždy rozbíjí odkazy — proto plochá.)

## 8. KOMPONENTY — postupové lišty a taby

### Postupové lišty (dvě varianty, obě k dispozici)
- **TimelineScroll** — vertikální časová osa, která se ROZSVĚCUJE při scrollu.
  Linka roste shora dolů, tečky i karty se postupně aktivují (ztlumené → plné).
  Vhodné pro příběh firmy, historii, vývoj. (Zdroj: Turovice /nas-pribeh)
- **StepsVertical** — statická vertikální lišta: číslo v kruhu vlevo, svislá
  spojovací linka, obsah vpravo s tagy a volitelným zvýrazněným boxem.
  Vhodné pro proces krok za krokem. (Zdroj: Turovice /prijeti)

### TABY — ZÁVAZNÉ PRAVIDLO PROVÁZANOSTI
Když web používá taby (přepínací sekce s oušky), MUSÍ být vždy jednoznačně
a graficky vidět provázanost mezi aktivním ouškem a obsahem pod ním:

- Aktivní ouško (tab) a jeho obsahový panel tvoří VIZUÁLNĚ JEDEN SPOJENÝ CELEK
  — propojené podkresem/pozadím, např. stejná barva pozadí ouška i panelu,
  ouško „nasedá" na panel bez viditelného předělu, nebo spojovací prvek.
- ŠPATNĚ (zakázáno): vodorovná řada čísel/oušek, pod kterou je oddělený panel
  bez vizuální vazby — uživatel nepozná, že panel patří k aktivnímu oušku.
- Po kliknutí na ouško musí být okamžitě a jednoznačně jasné, který obsah
  k němu patří. Provázanost je grafická, ne jen logická.

KOMPONENTA SPLŇUJÍCÍ TOTO PRAVIDLO: `ProcessTabsConnected` — aktivní ouško
má shodný podkres s panelem, maskovací proužek překryje předěl, ouško nasedá
na panel. Použít tuto komponentu, ne `ProcessTabs` (vodorovná řada s odděleným
panelem), pokud chceš provázané taby.
