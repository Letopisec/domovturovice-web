# PRÁVNÍ CHECKLIST — co musí být na klientském webu

**Datum vzniku:** 2026-06-08
**Vrstva:** `astro-web-starter` → `docs/PRAVNI_CHECKLIST.md`
**Účel:** Předpis pro Claude (NE pro Martina), co automaticky umístit na klientský
web podle typu klienta a typu prodeje, aby byl web právně v pořádku — a aby na nic
z toho nebylo možné zapomenout.

---

## 1. K čemu tento dokument slouží

Tohle je **předpis pro Claude**, ne příručka pro Martina. Martin s ním aktivně
nepracuje a nic si nemá pamatovat. Systém je postavený tak, že **rozhodnutí si
samo řekne o pozornost** — buď zastaví práci, nebo zůstane viditelné na webu,
dokud se nevyřeší.

**Klíčový princip: rozhodování se přesouvá na START (založení webu), ne na konec.**
Při zakládání webu se vyplní `src/config/client-profile.ts`. Dokud není vyplněný,
build to při každém spuštění hlásí. Rozhodnutí tedy nestojí na tom, že si Martin
nebo Claude něco vzpomene — vynucuje ho strojová kontrola, opakovaně.

**Čtyři vrstvy, jak to funguje dohromady:**
1. **`client-profile.ts`** = povinná vstupní data (typ klienta, prodej, cookies).
   Nevyplněné pole = `null`, na to build upozorní.
2. **Tento checklist** = předpis (CO je povinné pro danou kombinaci).
3. **`site.ts`** = konkrétní hodnoty (IČO, zápis, název…).
4. **Build kontrola** = automatické vynucení (viz kap. 5 — NEblokuje, ale je vidět).

**Princip „web připraví místo, texty dodá klient":** Claude NIKDY neskládá za
klienta platné právní texty (VOP, poučení o odstoupení, zásady cookies). To je
práce klienta / jeho právníka a klient za ně nese odpovědnost. Claude
**automaticky založí podstránku** s úvodním upozorněním (co tam patří a na co si
dát pozor) a **upozorní Martina** seznamem textů, které musí od klienta vyžádat.

---

## 2. Rozhodovací strom — tři nezávislé osy

Typ klienta se určí ze tří os v `client-profile.ts`, vyhodnocují se nezávisle.
Výsledné povinnosti = součet os (tabulka v kap. 3).

### Osa A — právní forma (kdo klient je)
Zdroj: `client-profile.ts → legalForm` + `site.ts → legal.registration`.

| Hodnota | Identifikační povinnost (§ 435 obč. zák.) |
|---|---|
| `sro` / `as` / `druzstvo` | Název, sídlo, IČO **+ zápis v OR** (soud + spisová značka). |
| `osvc-zr` (OSVČ v živn. rejstříku) | Jméno, sídlo, IČO **+ zápis v ŽR** (úřad). |
| `osvc-jine` (advokát, lékař…) | Jméno, sídlo, IČO + zápis v příslušné evidenci/komoře. |
| `spolek` / `nadace` / `ustav` | Název, sídlo, IČO **+ zápis ve veřejném rejstříku**. |

Právní základ: § 435 zák. č. 89/2012 Sb.; pro korporace § 7 zák. č. 90/2012 Sb.
DIČ jen u plátce DPH (povinné na daňových dokladech, na webu vhodné).

### Osa B — typ prodeje (co klient prodává přes web)
Zdroj: `client-profile.ts → sellsOnline`. Prodej běží přes formuláře (FAPI). Každý
typ plnění má jiný režim odstoupení od smlouvy.

| Hodnota | Příklad | Právo na odstoupení 14 dní |
|---|---|---|
| `ne` | čistě informační web | — |
| `digitalni` | e-booky, online kurzy | **NE** — ale jen při správném poučení (viz ⚠️) |
| `terminovana` | startovné na závod, vstupenka na termín | **NE** — volný čas k určenému termínu (§ 1837) |
| `prubezna` | členství v klubu bez pevného termínu | **ANO** — 14 dní, řešit poměrnou úhradu |
| `zbozi` | trička, čepice | **ANO** — 14 dní v plném rozsahu |
| `vyzaduje-pravni-posouzeni` | hraniční případ (viz ⚠️ níže) | rozhoduje člověk, ne automat |

> ⚠️ **HRANIČNÍ PŘÍPADY — sem automat nesmí.** Pokud plnění nejde jednoznačně
> zařadit, hodnota MUSÍ být `vyzaduje-pravni-posouzeni` a build na to upozorní
> jako na bod k lidskému rozhodnutí. Typické pasti:
> - **Kroužek/kurz na celý školní rok nebo členství „od–do"** — NEMUSÍ být
>   „určitý termín" ve smyslu výjimky § 1837. Zploštit to na `terminovana` je
>   riziko: klient odmítne vrátit peníze s odkazem na web a spotřebitel uspěje.
> - **Spolek vybírající členský příspěvek** vs. **spolek prodávající startovné
>   nečlenům** — členský příspěvek není „prodej služby" v režimu spotřebitelské
>   smlouvy; startovné pro veřejnost ano. Rozlišit.

> ⚠️ **DIGITÁLNÍ OBSAH — výjimka NENÍ automatická.** Právo na odstoupení u
> e-booku/kurzu zaniká jen tehdy, když web spotřebitele PŘED nákupem výslovně
> poučí, že (a) souhlasí se zahájením dodání před uplynutím lhůty a (b) tím
> pozbývá právo na odstoupení (§ 1837). Checkout řeší FAPI, ale **poučení a VOP
> musí být na webu klienta.** Bez nich je e-book vratný do 14 dní.

### Osa C — cookies / měření
Zdroj: `client-profile.ts → usesCookies`. (Řeší samostatný cookie balíček —
viz Todoist. Zde jen evidováno, ať profil počítá s polem od začátku.)

| Hodnota | Důsledek |
|---|---|
| `jen-nezbytne` | bez lišty (žádné měření). **Default.** |
| `analytika` / `marketing` | vyžaduje opt-in cookie lištu + podstránku o cookies. |

---

## 3. Co je povinné — tabulka podle typu

„○" = web připraví podstránku/místo, text dodá klient. „●" = vyplní se ze
`site.ts`. „—" = netýká se.

| Povinnost | Inf. web | + digitální | + termínovaná | + průběžná | + zboží |
|---|---|---|---|---|---|
| Identifikační blok (§ 435) | ● | ● | ● | ● | ● |
| GDPR věta u formuláře | ● | ● | ● | ● | ● |
| Zásady zpracování OÚ (podstránka) | ○ | ○ | ○ | ○ | ○ |
| VOP (podstránka) | — | ○ | ○ | ○ | ○ |
| Poučení o odstoupení / o jeho zániku | — | ○* | ○* | ○ | ○ |
| Předsmluvní info (cena vč. DPH, platba vč. zpracovatele FAPI, dodání) | — | ○ | ○ | ○ | ○ |
| ČOI + mimosoudní řešení sporů (ADR) | — | ○ | ○ | ○ | ○ |
| Cookie lišta + zásady cookies | dle osy C | dle osy C | dle osy C | dle osy C | dle osy C |
| EAA / WCAG 2.1 AA | dle kap. 6 | dle kap. 6 | dle kap. 6 | dle kap. 6 | dle kap. 6 |

\* U digitálního obsahu a termínované služby jde o **poučení, že právo na
odstoupení nevzniká / zaniká** (a za jakých podmínek), ne klasický 14denní
formulář. Přesné znění dodá klient.

---

## 4. Mapování na data a podstránky

**Identifikace** → `site.ts → legal`: `ico`, `dic`, `legalForm`, `registration`,
`representative`, `dataBox`, `registeredAddress` (sídlo, jen když ≠ provozovna).
Patička + Schema je čtou. Princip „prázdné = skryté".

**GDPR věta u formuláře** → součást LeadFormu.

**Podstránky, které web AUTOMATICKY zakládá ve fázi skeletonu** (plochá URL dle
STANDARD.md), když to profil vyžaduje:
- `domena.cz/zasady-ochrany-osobnich-udaju` — vždy, když je na webu formulář
- `domena.cz/obchodni-podminky` — při jakémkoli prodeji (`sellsOnline ≠ ne`)
- `domena.cz/odstoupeni-od-smlouvy` — prodej s právem na odstoupení (prubezna,
  zbozi) nebo poučení o jeho zániku (digitalni, terminovana)
- `domena.cz/zasady-pouzivani-cookies` — když `usesCookies ≠ jen-nezbytne`

**Každá auto-založená podstránka NESE V TĚLE úvodní upozornění** (viz kap. 5.3),
viditelné pro Martina i klienta, dokud se text nepřepíše.

---

## 5. Ochranná pravidla (vynucení) — NEBLOKUJÍCÍ, ale VIDITELNÁ

Build kontrola **nikdy neblokuje** (web musí být po celou dobu stavby vidět na
pages.dev — Martinovi i klientovi). Místo blokace funguje takto:

### 5.1 Výstup při startu (aktivní soupis)
Po `npm run build` (a jako samostatný report při založení) Claude/skript vypíše
**seznam chybějících náležitostí** — aktivně, ne na vyžádání. To je odpověď na
„potřebuju na startu vědět, co chybí".

### 5.2 Viditelný placeholder na webu
Chybějící povinná podstránka NEzmizí do konzole — existuje jako **live stránka
s nápadným upozorněním** (viz 5.3). Vidí ji Martin i klient při každém načtení.
Build kontroluje, že upozorňovací blok v souboru pořád je → dokud tam je, hlásí
stránku jako nedoplněnou. Nelze omylem nasadit web s tichým placeholderem.

### 5.3 Šablona úvodního upozornění (v těle každé auto-založené podstránky)
Formát (příklad pro VOP u digitálního obsahu):

> **⚠️ TENTO TEXT JE NUTNÉ DOPLNIT — bez něj web nesmí jít na ostrou doménu.**
> Toto jsou Všeobecné obchodní podmínky pro prodej **digitálního obsahu**
> (e-booky, online kurzy).
> **Musí obsahovat:** identifikaci prodávajícího; popis produktu a cenu vč. DPH;
> způsob platby vč. uvedení zpracovatele platby (FAPI); **výslovné poučení, že
> u digitálního obsahu spotřebitel souhlasem se zahájením dodání pozbývá právo
> na odstoupení (§ 1837 obč. zák.)**; reklamační podmínky; kontakt na ČOI a
> informaci o mimosoudním řešení sporů (ADR).
> **Text dodá klient nebo jeho právník.**

Obdobné šablony existují pro každou podstránku (zásady OÚ, odstoupení, cookies),
vždy s konkrétním „musí obsahovat" a varováním na časté chyby.

### 5.4 Evidence přenosu odpovědnosti
Reálný scénář: klient řekne „pusťte to, VOP dodám později". To je legitimní —
odpovědnost přechází na klienta. Zachytí se v profilu jako VĚDOMÉ rozhodnutí,
ne jako přehlédnutí:
```
vopStatus: 'klient-doda-pozdeji'   // | 'hotovo' | null(=chybí, neřešeno)
```
`null` = build hlásí „neřešeno". `klient-doda-pozdeji` = build hlásí informativně
„čeká na klienta, odpovědnost na klientovi" a placeholder na webu zůstává. Máš
černé na bílém, kdo odpovědnost nese.

### 5.5 Pravidla, kdy Claude ZASTAVÍ a aktivně vyžaduje od Martina
Tato pravidla NEzastavují build — zastavují **Claude při tvorbě**, aby si vynutil
podklad, místo aby domýšlel:
- `legalForm ∈ {sro, as, druzstvo, spolek, nadace, ustav}` a `registration`
  prázdné → ZASTAV, vyžádej zápis (soud + spisová značka).
- `legalForm = osvc-*` a `registration` prázdné → vyžádej zápis v ŽR.
- `sellsOnline = vyzaduje-pravni-posouzeni` → ZASTAV, předlož Martinovi hraniční
  případ k rozhodnutí, nedomýšlej režim odstoupení.
- jakýkoli prodej a chybí podstránka VOP / odstoupení → ZASTAV, založ s
  upozorněním a vyžádej text.
- formulář na webu a chybí zásady OÚ → ZASTAV, založ a vyžádej text.

### 5.6 Validace formátu (ne jen přítomnosti)
Build ověřuje i správnost, ne jen vyplněnost:
- `ico` = 8 číslic + sedí kontrolní algoritmus (překlep v IČO = vadný povinný údaj).
- `legalForm = sro/as` → `registration` odpovídá vzoru „soud + spisová značka".
- `legalName` není prázdné, když `legalForm` je právnická osoba.

---

## 6. EAA / přístupnost (zákon č. 424/2023 Sb.)

Ověřená fakta (stav 06/2026):
- Zák. č. 424/2023 Sb. (transpozice EU 2019/882, European Accessibility Act),
  účinnost **28. 6. 2025**. Požadavek: **WCAG 2.1 úroveň AA** (norma EN 301 549).
- Týká se digitálních služeb spotřebitelům (e-shopy, smlouvy na dálku, banky,
  e-knihy…).
- **Výjimka mikropodnik:** méně než 10 zaměstnanců **A ZÁROVEŇ** roční obrat do
  2 mil. EUR. Obě podmínky současně. Není automatická ani trvalá.
- Archivní obsah zveřejněný před 28. 6. 2025 a dále neupravovaný je vyňat.

**Závěr pro Martinovy klienty:** Samotný prodej přes formulář EAA NEzapne — o
povinnosti rozhoduje **velikost firmy**, ne to, že klient prodává. Proto profil
sbírá `employeesUnder10` a `turnoverUnder2M`: pokud **obě** `true` → mikropodnik,
EAA nepovinné. Pokud kterákoli `false` → EAA dopadá, upozornit. Většina klientů =
mikropodnik. **Přesto WCAG 2.1 AA dodržovat** (starter to z velké části plní:
kontrast, hierarchie nadpisů, ovládání klávesnicí, alt texty) — dobrá praxe a
pojistka proti růstu klienta.

---

## 7. Data k revizi (aby dokument nezestárl potichu)

- **19. 6. 2026** — nové „tlačítko pro odstoupení od smlouvy" u prodeje na dálku.
  Po účinnosti ověřit dopad a doplnit do kap. 3.
- **WCAG 2.2** — sledovat; může nahradit 2.1 jako požadovanou úroveň.
- **Cookies** — řeší samostatný balíček (Todoist); po dokončení provázat s osou C.
- Hranice mikropodniku a výčet služeb dle EAA — ověřit při každé větší novele.

---

*Living document — aktualizovat z projektu „AI" při změně legislativy nebo
portfolia toho, co klienti prodávají. Ověřená právní fakta vždy doložit webovým
ověřením, nikdy nepsat z paměti.*
