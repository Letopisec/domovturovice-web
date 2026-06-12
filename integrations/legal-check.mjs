// integrations/legal-check.mjs — NEBLOKUJÍCÍ právní kontrola.
// Běží při každém buildu (hook astro:build:start), jen VYPISUJE soupis chybějících
// právních náležitostí do konzole. NIKDY neblokuje build (žádný throw/process.exit) —
// web musí být po celou dobu stavby vidět na pages.dev.
//
// Logika přesně dle docs/PRAVNI_CHECKLIST.md kap. 3–6. Hodnoty se čtou z .ts souborů
// jako TEXT (fs + regex), protože .ts nejde v Node přímo importovat. Soubory jsou naše
// šablony s plochou strukturou primitiv, takže textový parse stačí.

import fs from 'node:fs';

const PROFILE_PATH = 'src/config/client-profile.ts';
const SITE_PATH = 'src/config/site.ts';

// Právnické osoby (zápis v rejstříku + povinný plný právní název).
const PRAVNICKE_OSOBY = ['sro', 'as', 'druzstvo', 'spolek', 'nadace', 'ustav'];

// ── Parsování hodnot ──────────────────────────────────────────────
// Z client-profile.ts: vrať null | true | false | string | undefined(nenalezeno).
function readProfileValue(text, key) {
  const m = text.match(new RegExp('\\b' + key + '\\s*:\\s*([^,\\n]+)'));
  if (!m) return undefined;
  const v = m[1].trim();
  if (v === 'null') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  const q = v.match(/^'([^']*)'$/);
  if (q) return q[1];
  return v;
}

// Ze site.ts: vrať obsah stringového literálu daného klíče (nebo '' když nenalezeno/prázdné).
function readSiteString(text, key) {
  const m = text.match(new RegExp('\\b' + key + "\\s*:\\s*'([^']*)'"));
  return m ? m[1] : '';
}

// ── Český kontrolní algoritmus IČO (mod 11) ───────────────────────
function icoValid(ico) {
  if (!/^\d{8}$/.test(ico)) return false;
  const d = ico.split('').map(Number);
  const weights = [8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += d[i] * weights[i];
  const mod = sum % 11;
  const check = (11 - mod) % 10;
  return check === d[7];
}

// ── Pomocné pro existenci/doplněnost podstránek ───────────────────
function pageExists(name) {
  return fs.existsSync('src/pages/' + name);
}
function pageHasNotice(name) {
  try {
    return fs.readFileSync('src/pages/' + name, 'utf8').includes('<LegalPageNotice');
  } catch {
    return false;
  }
}
// Přidá řádek dle stavu podstránky: chybí soubor / není doplněná / (jinak OK = nic).
function checkPage(issues, name) {
  if (!pageExists(name)) {
    issues.push('chybí podstránka ' + name);
  } else if (pageHasNotice(name)) {
    issues.push('podstránka ' + name + ' není doplněná (text dodá klient)');
  }
}

function runCheck() {
  const issues = []; // chybějící / vadné náležitosti
  const infos = []; // informativní (ne chyba)

  const profile = fs.existsSync(PROFILE_PATH) ? fs.readFileSync(PROFILE_PATH, 'utf8') : '';
  const site = fs.existsSync(SITE_PATH) ? fs.readFileSync(SITE_PATH, 'utf8') : '';

  const legalForm = readProfileValue(profile, 'legalForm');
  const sellsOnline = readProfileValue(profile, 'sellsOnline');
  const usesCookies = readProfileValue(profile, 'usesCookies');
  const hasForm = readProfileValue(profile, 'hasForm');
  const employeesUnder10 = readProfileValue(profile, 'employeesUnder10');
  const turnoverUnder2M = readProfileValue(profile, 'turnoverUnder2M');
  const vopStatus = readProfileValue(profile, 'vopStatus');

  // (1) Profil nevyplněn → nahlásit a skončit (víc nemá smysl hlásit).
  if (legalForm === null || legalForm === undefined || sellsOnline === null || sellsOnline === undefined) {
    issues.push('PROFIL NEVYPLNĚN — vyplň src/config/client-profile.ts při zakládání webu');
    printBlock(issues, infos);
    return;
  }

  const ico = readSiteString(site, 'ico');
  const registration = readSiteString(site, 'registration');
  const legalName = readSiteString(site, 'legalName');
  const jePravnickaOsoba = PRAVNICKE_OSOBY.includes(legalForm);

  // (2) Identifikace — zápis v rejstříku.
  if (jePravnickaOsoba && !registration) {
    issues.push('chybí zápis v rejstříku (soud + spisová značka)');
  } else if (typeof legalForm === 'string' && legalForm.startsWith('osvc-') && !registration) {
    issues.push('chybí zápis v ŽR/evidenci');
  }

  // (3) IČO.
  if (!ico) {
    issues.push('chybí IČO');
  } else if (!icoValid(ico)) {
    issues.push('IČO má neplatný kontrolní součet (překlep?)');
  }

  // (4) Plný právní název u právnické osoby.
  if (jePravnickaOsoba && !legalName) {
    issues.push('chybí plný právní název (legalName v site.ts)');
  }

  // (5) Prodej → VOP (vždy když se prodává) + odstoupení (dle typu).
  if (sellsOnline !== 'ne') {
    checkPage(issues, 'obchodni-podminky.astro');
    if (sellsOnline === 'zbozi' || sellsOnline === 'prubezna' || sellsOnline === 'digitalni' || sellsOnline === 'terminovana') {
      checkPage(issues, 'odstoupeni-od-smlouvy.astro');
    }
  }

  // (6) Formulář → zásady zpracování OÚ.
  if (hasForm === true) {
    checkPage(issues, 'zasady-ochrany-osobnich-udaju.astro');
  }

  // (7) Cookies → zásady cookies.
  if (usesCookies && usesCookies !== 'jen-nezbytne') {
    checkPage(issues, 'zasady-pouzivani-cookies.astro');
  }

  // (8) Hraniční případ — rozhoduje člověk.
  if (sellsOnline === 'vyzaduje-pravni-posouzeni') {
    issues.push('HRANIČNÍ PŘÍPAD — o režimu odstoupení rozhoduje člověk, ne automat (viz checklist kap. 2)');
  }

  // (9) EAA / přístupnost.
  if (employeesUnder10 === null || employeesUnder10 === undefined || turnoverUnder2M === null || turnoverUnder2M === undefined) {
    issues.push('EAA neurčeno — chybí údaj o velikosti firmy (checklist kap. 6)');
  } else if (!(employeesUnder10 === true && turnoverUnder2M === true)) {
    issues.push('EAA (přístupnost) může dopadat — ověř velikost firmy (checklist kap. 6)');
  }

  // (10) Přenos odpovědnosti za VOP — informativně.
  if (vopStatus === 'klient-doda-pozdeji') {
    infos.push('VOP: čeká na klienta, odpovědnost na klientovi');
  }

  printBlock(issues, infos);
}

function printBlock(issues, infos) {
  const line = '─'.repeat(64);
  console.log('\n' + line);
  console.log('⚖️  PRÁVNÍ KONTROLA (neblokující)');
  console.log(line);
  if (issues.length === 0) {
    console.log('  ✓ vše v pořádku');
  } else {
    for (const i of issues) console.log('  • ' + i);
  }
  for (const i of infos) console.log('  ℹ ' + i);
  console.log(line + '\n');
}

export default function legalCheck() {
  return {
    name: 'legal-check',
    hooks: {
      'astro:build:start': () => {
        try {
          runCheck();
        } catch (e) {
          // NIKDY neblokovat build — jen oznámit, že kontrola selhala.
          console.log('⚖️  PRÁVNÍ KONTROLA: kontrolu nelze spustit (' + (e && e.message) + ') — build pokračuje.');
        }
      },
    },
  };
}
