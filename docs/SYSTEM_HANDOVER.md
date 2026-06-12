# SYSTÉM PRO TVORBU WEBŮ — kompletní handover a provozní manuál

**Datum vzniku:** 2026-06-02
**Autor systému:** Martin Ritt (martin@ritt.cz) ve spolupráci s Claude
**Účel dokumentu:** Přenést kompletní znalost o vzorovém systému pro tvorbu webů
do projektu „AI", odkud se bude systém spravovat a odkud budou vznikat nové weby.

---

## OBSAH

**ČÁST A — JAK TO VZNIKLO A PROČ** (kontext, rozhodnutí, zamítnuté cesty)
1. Výchozí situace a cíl
2. Klíčová rozhodnutí a proč padla
3. Co se zamítlo a proč
4. Poučení zabudovaná do systému

**ČÁST B — JAK S TÍM PRACOVAT** (provozní manuál)
5. Co je vzorový starter a kde je
6. Architektura systému (3 vrstvy)
7. Katalog komponent
8. Plochá URL struktura
9. Decap CMS (správa obsahu klientem)
10. Jak založit nový web — krok za krokem
11. Stav projektu Tepelka Kadeřábek
12. Co ještě zbývá dořešit

---
---

# ČÁST A — JAK TO VZNIKLO A PROČ

## 1. Výchozí situace a cíl

**Výchozí stav:** Martin postavil web Domov Turovice (Astro + GitHub + Cloudflare
Pages). Fungoval, ale byl postavený jako 21 ručně poskládaných stránek — každá
700–1145 řádků, veškerý obsah i CSS nakopírovaný inline v každé stránce. Změna
jednoho prvku znamenala ruční opravu ve 22 souborech.

**Cíl:** Martin chce za rok realizovat cca **30 podobných webů**. Všechny jsou
informačního typu (jako Domov Turovice) — služby, lokální byznys, obsah + blog.
NIKDY e-shop, maximálně prodejní formulářová stránka. Potřebuje proto
**opakovatelný produkční systém**, ne jednorázové kopírování.

**Co se u každého nového webu mění:** barvy, fonty, styl/tón komunikace, logo,
kontakty, fotky, klíčová slova, struktura stránek. Někdy i použité komponenty
(ne každá stránka má stejné).

**Co zůstává stejné:** technický základ, komponentový systém, deployment, SEO
pravidla, best practices, plochá URL struktura.

## 2. Klíčová rozhodnutí a proč padla

### Rozhodnutí 1: Komponentový systém místo inline stránek (VARIANTA B)
Místo „Turovice znovu" (každá stránka 700–1000 řádků inline kódu) jsme zvolili
**komponentovou továrnu**: opakující se bloky jsou skutečné Astro komponenty
s props. Stránka pak není 900 řádků, ale ~50–110 řádků poskládaných komponent.

**Důkaz proběhl:** stránka `/jak-pecujeme` z Turovic (650 řádků) přepsaná do
komponent = 110 řádků, vizuálně identická. Z toho 414 řádků CSS, které se
opakovaly ve 22 stránkách, je teď v komponentách JEDNOU.

**Proč:** 6× méně tokenů na stránku, změna designu na jednom místě, konzistence.
DŮLEŽITÉ: konzistence funguje VŽDY jen uvnitř jednoho webu. Každý web je
samostatný repozitář — změna v jednom webu se NIKDY nepropíše do jiných.

### Rozhodnutí 2: GitHub Template místo klonování
Vzorový repozitář je označen jako **GitHub Template**. Nový web vzniká přes
„Use this template" = nezávislá kopie. Žádné mazání cizího obsahu, žádné
propojení mezi weby.

### Rozhodnutí 3: Pokročilý token systém z Tepelky (VARIANTA A)
Tepelka (původně rozpracovaná přes Claude Code) měla LEPŠÍ token systém než
náš první starter — `--color-*` paletu, 8px spacing grid, propracovanější
odstíny. Rozhodli jsme **povýšit starter na tento systém**, dokud byl skoro
prázdný. Lepší investovat půlhodinu teď než přepisovat 30 webů později.

### Rozhodnutí 4: Decap CMS ve všech webech
Martin chce, aby klient mohl sám spravovat blog/články bez programování.
Decap CMS je proto zabudován do starteru pro všechny weby.
- Přihlášení: **Google login** (Gmail má skoro každý, řeší si reset hesla sám —
  Martin nespravuje hesla 30 klientů).
- Rozsah: **blog/poradna články** s rich-text editorem (WordPress-like) + fotky.
  Články se vykreslují do předem dané šablony (konzistentní vzhled).

### Rozhodnutí 5: Plochá URL struktura
Všechny weby mají **plochou strukturu**: `domena.cz/nazev` pro stránky,
příspěvky, rozcestníky kategorií i štítků. Žádné prefixy, žádné víceúrovňové
cesty, žádné breadcrumbs.

**Proč:** Martin díky tomu nikdy neměl problém s přejmenováním. Když se měnila
celá kategorie u víceúrovňové struktury, vždy to rozbilo URL. Plochá struktura
to eliminuje. Kategorie/štítky jsou samostatné rozcestníky a u článku jsou
klikací (jako WordPress).

### Rozhodnutí 6: Účty na Martinově GitHubu/Cloudflare
Všechny weby vznikají na Martinově účtu (`Letopisec` na GitHubu + jeho
Cloudflare). Při odchodu klienta se repozitář přenese na jeho účet
(GitHub Transfer ownership), klient si připojí vlastní Cloudflare.
Web nikdy není „uvězněný" — celý je v Gitu.

**Proč ne účty klientů od začátku:** noční můra při správě 30 webů (přístupy,
oprávnění do 30 účtů). Přenos při odchodu je řešitelný a vzácný.

## 3. Co se zamítlo a proč

- **WordPress + Divi/Elementor** — zamítnuto. Martin přešel na Astro (čistý kód,
  rychlost, přenositelnost, žádný proprietární zámek). Tepelka původně běžela
  na WordPress + Elementor — překonáno.

- **Dostavění starého Tepelka projektu** (Astro v6.3.3 + Decap, rozpracováno
  přes Claude Code) — zamítnuto. Měl jinou strukturu tokenů a Astro verzi než
  náš systém. Místo dostavby jsme z něj VZALI VIZUÁL (HTML/CSS klient schválil)
  a postavili znovu čistě na starteru. Vizuál zachován 1:1, uvnitř jednotný systém.

- **Vlastní jméno+heslo pro Decap login** — zamítnuto ve prospěch Google loginu
  (Martin by jinak spravoval hesla 30 klientů a řešil jejich resety).

- **sitemap @astrojs/sitemap 3.7.x** — zamítnuto, nekompatibilní s Astro 4.16
  (chyba „Cannot read properties of undefined (reading 'reduce')"). Připnuto
  na verzi **3.2.1**, která funguje.

- **Stavět všech 16 Molti komponent dopředu** — zamítnuto. Místo toho „základní
  sada teď + dorůstání podle potřeby". Komponenta se vytvoří, když ji nějaká
  sekce potřebuje, a od té chvíle je k dispozici pro všechny weby.

## 4. Poučení zabudovaná do systému (z Domov Turovice)

Tato poučení jsou přímo v kódu/konfiguraci starteru, aby se chyby neopakovaly:

- **`site` v astro.config = produkční doména, NIKDY pages.dev.** Jinak špatné
  canonical URL + Cloudflare hlásí „Uploaded 0 files" (cache hit, obsah se
  nenasadí). V configu je komentář s vysvětlením.
- **CSS jen přes proměnné z tokens.css** — žádné hardcoded barvy/px.
- **`main` má `padding-top: var(--nav-height)`** — hero nepřidává vlastní offset.
- **NODE_VERSION 20 v Cloudflare Pages** (ne 18) — jinak build selže.
- **Tokeny (GitHub/Cloudflare) vždy z Google Drive, nikdy z paměti.**

---
---

# ČÁST B — JAK S TÍM PRACOVAT

## 5. Co je vzorový starter a kde je

**GitHub Template repozitář:** `github.com/Letopisec/astro-web-starter`

Je to „razítko", ze kterého vznikají nové weby. Sám se needituje při tvorbě
webů — edituje se jen tehdy, když chceš VYLEPŠIT systém pro budoucí weby.
Změna starteru se projeví jen v BUDOUCÍCH webech, nikdy zpětně v existujících.

**Tech stack:** Astro 4.x · GitHub · Cloudflare Pages · Decap CMS

## 6. Architektura systému (3 vrstvy)

**Vrstva 1 — GitHub Template `astro-web-starter`**
Kód, komponenty, deployment pipeline, dokumentace. Žije v Gitu.

**Vrstva 2 — Claude projekt pro konkrétní web** (např. „Tepelka Kadeřábek")
Lehké řídicí dokumenty: Project instructions, KW soubor, podklady o firmě.
Každý Claude projekt má vlastní paměť a project knowledge — neuvidí ostatní
projekty. Co tam má být, musíš vědomě vložit.

**Vrstva 3 — Projekt „AI"** (centrální správa systému)
Odtud spravuješ a vylepšuješ samotný starter. Sem patří tento dokument.

## 7. Katalog komponent (18 bloků)

V `src/components/blocks/`. Stránka se z nich skládá. Claude komponenty vybírá
sám podle schválené struktury — uživatel je neřeší.

| Komponenta | K čemu |
|---|---|
| PageHero | tmavý hero (gradient přes volitelnou fotku) |
| TrustBar | pruh důvěry pod hero (ikona + hodnota + popisek) |
| StatStrip | jednoduchý pruh statistik (bez ikon) |
| CardGrid | mřížka karet (ikona + nadpis + popis) |
| SplitSection | text + obrázek vedle sebe |
| Steps | číslované kroky (statické, vodorovné) |
| StepsVertical | vertikální postupová lišta: číslo v kruhu + linka + obsah vpravo |
| TimelineScroll | vertikální časová osa, ROZSVĚCUJE se při scrollu |
| ProcessTabs | proces 1–5 s přepínáním (vodorovná řada, oddělený panel) |
| ProcessTabsConnected | taby s ouškem PROVÁZANÝM s panelem (jeden vizuální celek) |
| CompareTable | srovnávací tabulka se zvýrazněným sloupcem |
| TestimonialCards | karty referencí |
| TestimonialCarousel | carousel referencí — citace, hvězdičky, fotka, autor+role; autoplay, fade, ustálená výška |
| FaqAccordion | rozbalovací otázky a odpovědi |
| LeadForm | formulář (poptávka/newsletter), režim inline i modal; pole z presetu (formPresets.ts), data jdou na /api/lead → adaptér dle destination. Nahrazuje ContactForm. |
| Highlight | zvýrazněný citát |
| CTASection | závěrečná výzva k akci |
| RelatedCards | karty článků / „co dál" (obrázek, kategorie, datum) |

**Postupové lišty — dvě varianty:** TimelineScroll (rozsvěcuje se při scrollu,
pro příběh/historii) a StepsVertical (statická, pro proces krok za krokem).
Obě přeneseny 1:1 z Domov Turovice (/nas-pribeh a /prijeti).

**TABY — závazné pravidlo:** pokud web používá taby, aktivní ouško a jeho panel
MUSÍ tvořit vizuálně jeden spojený celek (provázané podkresem). Zakázáno: řada
oušek s odděleným panelem bez vizuální vazby. Detail v docs/STANDARD.md sekce 8.

## 8. Plochá URL struktura

**Vše na `domena.cz/[slug]`** — řešeno jednou dynamickou routou
`src/pages/[slug].astro`, která rozlišuje 3 typy:
1. **Článek** → `domena.cz/jak-funguje-tepelne-cerpadlo`
2. **Kategorie** (rozcestník) → `domena.cz/dotace` (vypíše články kategorie)
3. **Štítek** (rozcestník) → `domena.cz/novostavba` (vypíše články se štítkem)

- `src/utils/slug.ts` převádí české názvy na slug (diakritika → ASCII).
- U článku jsou kategorie i štítky KLIKACÍ → vedou na rozcestník (jako WordPress).
- ŽÁDNÉ breadcrumbs, ŽÁDNÉ prefixy, ŽÁDNÉ víceúrovňové cesty.
- **KONTROLA KOLIZÍ:** build spadne se srozumitelnou hláškou, když se dva slugy
  kryjí. Pravidlo: před vytvořením článku/stránky ověřit, že slug neexistuje.

## 9. Decap CMS (správa obsahu klientem)

- Administrace na `domena.cz/admin` (`public/admin/`).
- Klient přidává články: nadpis, datum, kategorie, štítky, úvodní fotka, perex,
  autor, tělo (rich-text: nadpisy, tučné, kurzíva, odrážky, odkazy, obrázky),
  SEO popis.
- Články → `src/content/clanky/`, vykreslují se přes `[slug].astro` do konzistentní
  šablony. Klient ovlivní obsah, ne vzhled.
- **Autentizace přes Google login** — zatím PŘIPRAVENO, ne aktivováno. Backend
  `git-gateway`. Aktivuje se jako samostatný krok před předáním klientovi
  (vyžaduje jednorázové nastavení autentizační brány na Cloudflare).

## 10. Jak založit nový web — krok za krokem

### Den 1 — setup (~30 min)
1. Na GitHubu u `astro-web-starter` → tlačítko **„Use this template"** → nový
   repozitář (např. `nazevklienta-web`).
2. `astro.config.mjs` → `SITE_URL` = produkční doména.
3. `src/config/site.ts` → vyplnit název, kontakty, adresu (= provozovna), Schema typ,
   sekci `legal` (IČO povinné; DIČ/právní forma/zápis v OR dle právní formy klienta)
   a reálné odkazy `social`. POZN.: `address` = provozovna (zobrazuje se + Schema);
   `legal.registeredAddress` = sídlo, vyplnit JEN když se liší od provozovny.
4. `src/styles/tokens.css` → nastavit `--color-primary` (+ hover, soft) a fonty.
5. `src/layouts/Layout.astro` → upravit `fontsHref` podle zvolených fontů.
6. `public/images/logo.svg` → vložit logo (POZOR: složka `public/images/` se
   z template nepřenese prázdná — vytvořit ji).
7. `public/robots.txt` → doplnit doménu do Sitemap řádku.
8. **Cloudflare Pages:** Workers & Pages → Create application → dole odkaz
   **„Looking to deploy Pages? Get started"** (NE Worker!) → Connect to Git →
   repozitář. Nastavení: Framework **Astro**, build `npm run build`, output
   `dist`, Environment variable **`NODE_VERSION` = `20`**. Save and Deploy.
9. **Formulář (volitelné, když web sbírá poptávky):** v Cloudflare Pages → Settings →
   Variables and Secrets nastav SHEETS_WEBHOOK_URL (Web app URL Apps Scriptu klientovy
   tabulky) a FORM_TOKEN (alfanumerický, bez znaků { } ` $). Bez těchto proměnných
   endpoint /api/lead vrátí 'not configured' a formulář neodešle — to je očekávané,
   dokud se env nenastaví. Šablona tabulky + Apps Scriptu je v Google Drive (Molti složka),
   NE v repu.
10. **`src/config/client-profile.ts`** → vyplnit typ firmy (`legalForm`), co web prodává
    (`sellsOnline`), cookies (`usesCookies`), formulář (`hasForm`) a EAA velikost firmy
    (`employeesUnder10`, `turnoverUnder2M`). Určuje, jaké právní podstránky web potřebuje;
    build na nevyplněné (`null`) při každém spuštění upozorní. Pravidla v docs/PRAVNI_CHECKLIST.md.

#### Mapování vstupní klientské tabulky → site.ts (sekce legal)
| Vstupní údaj klienta | Klíč v site.ts |
|---|---|
| IČO | legal.ico |
| DIČ | legal.dic |
| Právní forma | legal.legalForm |
| Zápis v OR (soud, oddíl, vložka) | legal.registration |
| Datová schránka | legal.dataBox |
| Jednatel / odpovědná osoba | legal.representative |
| Sídlo (jen když ≠ provozovna) | legal.registeredAddress |

### Tvorba stránek (workflow s Claude)
1. Zadáš stránku → Claude navrhne STRUKTURU (nadpisy + co je pod nimi) + KW
   mapování → ČEKÁ na schválení.
2. Po schválení Claude složí stránku z komponent.
3. Lokální build (`npm run build`) bez chyb.
4. Commit + push → Cloudflare deploy. Výstup VŽDY přímo na web, nikdy artifact.
5. Na konci výpis použitých KW s hledaností + commit hash.

Pořadí webu: homepage → seznam prioritních stránek → jedna stránka →
potvrzení → další.

### Závazné zdroje v každém repu (Claude je čte)
- `docs/STANDARD.md` — zdroj pravdy (SEO, workflow, plochá struktura, pravidla)
- `docs/WEB_BEST_PRACTICES.md` — délky vět/odstavců, hierarchie, kontrast, CTA
- `README.md` — katalog komponent + checklist

## 11. Stav projektu Tepelka Kadeřábek (první ostrý web ze systému)

- **Repozitář:** `github.com/Letopisec/tepelka-kaderabek-web` (z template)
- **Doména:** tepelka-kaderabek.cz (+ tepelkakaderabek.cz přesměruje na ni)
- **Live:** tepelka-kaderabek-web.pages.dev (nasazeno na Cloudflare Pages)
- **Klient:** Tepelka Kadeřábek s.r.o., IČO 23088109, Opava, partner IVT
- **Barvy:** modrá #325096 + červená #BE2832 | **Fonty:** Crimson Text + Inter
- **HOTOVO:** homepage 1:1 podle schváleného návrhu (hero, trust bar, proces 1–5,
  výhody, srovnávací tabulka, reference, FAQ, formulář, články), Header, Footer,
  Schema LocalBusiness + WebSite + FAQPage.
- **Pokračuje se v samostatném Claude projektu „Tepelka Kadeřábek"** (má vlastní
  Project instructions). DŮLEŽITÉ: Tepelka má vlastní paměť — viz tento dokument
  pro kontext systému.
- **Pozn.:** Tepelka má rozhodnutou strukturu 7 stránek (Homepage, O nás,
  Produkty, Služby, Průvodce, Legislativa a dotace, Kontakt). Plochá struktura
  pro články se v Tepelce dolaďuje podle vzoru ze starteru.

## 12. Co ještě zbývá dořešit

- **Google autentizace pro Decap** — jednorázové nastavení brány na Cloudflare,
  pak funguje pro všechny weby. Řešit před prvním předáním klientovi.
- **Doladění Tepelky** — zbývající stránky dle struktury 7 stránek, sjednocení
  ploché struktury článků dle vzoru ze starteru.
- **Při dalším webu (č. 3+)** se už nic z výše uvedené stavby neopakuje —
  jen „Use this template" + den 1 setup + tvorba stránek.

---
---

## 13. Projektový tok — jak vzniká nový web (ZÁVAZNÝ POSTUP)

Tři vrstvy a jejich role. Každá věc patří do právě jedné vrstvy:

**Projekt „AI" = DÍLNA SYSTÉMU.** Odsud:
- Založí se GitHub repozitář z template (`Use this template` / API „generate").
- Připraví se STARTOVACÍ DOKUMENT pro nový web.
- Řeší se úpravy starteru a systémová pravidla.
Sem NEPATŘÍ stavba obsahu konkrétního webu.

**Claude projekt konkrétního webu = STAVBA JEDNOHO WEBU.** Sem:
- Vloží se startovací dokument (viz níže KAM).
- Doplní se podklady klienta (barvy, fonty, KW, struktura, fotky).
- Staví a opravují se stránky toho webu.

**GitHub = ZDROJ PRAVDY.** Project knowledge se mezi projekty NESDÍLÍ,
ale GitHub repozitáře ano (přes token z Google Drive). Proto vše
o systému (pravidla, komponenty, vzorový kód) žije na GitHubu, NIKDY
jen v paměti Claude. Paměť Claude se NEPOUŽÍVÁ jako zdroj pravdy —
je nespolehlivá napříč sezeními.

### Krok za krokem — rozběhnutí nového webu

1. **(Projekt „AI")** Založ GitHub repo z template `astro-web-starter`.
   Konvence názvu: `prijmeni-obor-web`, malými písmeny, bez diakritiky.
2. **(Projekt „AI")** Připrav startovací dokument webu (vzor: dokumenty
   START_*.md). Obsahuje: KROK 0 (načti z GitHubu), princip „nestav od
   nuly", repo, podklady k doplnění, závazná pravidla, workflow.
3. **(Claude UI)** Martin vytvoří nový Claude projekt (např. „Dohnalová TCM").
4. **(Claude UI — KLÍČOVÉ)** Startovací dokument se vloží do
   **PROJECT INSTRUCTIONS** projektu, NE jako první zpráva v chatu.
   Důvod: instrukce se načítají do KAŽDÉHO nového chatu automaticky;
   jedna zpráva platí jen pro ten jeden chat. (Na tomto uvízla Tepelka —
   stavěla „naslepo", protože kontext byl jen ve zprávě, ne v instrukcích.)
5. **(Nový projekt)** V projektu Martin přidává podklady klienta a začíná
   stavba: Den 1 setup → vizuální plán → skeleton → sekce po sekci.

### Pravidlo proti „stavbě naslepo"
Každý startovací dokument MUSÍ začínat KROKEM 0 = „načti zdroj pravdy
z GitHubu" + větou „hotový kód existuje, přebírej 1:1, nestav od nuly".
Bez toho Claude vymýšlí řešení znovu a po svém (prefix /poradna/, kotvy
#kategorie, oddělené taby) — přesně to, co systém zakazuje.

---
---

## PŘÍSTUPY A ODKAZY

- **Starter (template):** github.com/Letopisec/astro-web-starter
- **Tepelka:** github.com/Letopisec/tepelka-kaderabek-web
- **Domov Turovice:** github.com/Letopisec/domovturovice-web
- **GitHub účet:** Letopisec | **Cloudflare:** Martin@ritt.cz's Account
- **API tokeny (GitHub PAT, Cloudflare):** NIKDY v dokumentech ani z paměti.
  Vždy načítat z Google Drive dokumentu:
  https://docs.google.com/document/d/1s8bBW-a5iYIv21dSxAz2lyu3U3v01Xy6NKRlYRrxsNk
- **NODE_VERSION v Cloudflare Pages:** 20
- **sitemap verze:** připnuto na 3.2.1 (3.7.x nefunguje s Astro 4.16)

---

*Tento dokument je living document — při změnách systému (nové komponenty,
nová rozhodnutí) ho aktualizuj z projektu „AI".*
