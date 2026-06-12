// ════════════════════════════════════════════════════════════════
// CLIENT-PROFILE.TS — VSTUPNÍ PRÁVNÍ PROFIL KLIENTA
// ────────────────────────────────────────────────────────────────
// Vyplňuje se na DEN 1 při zakládání webu. Určuje, jaké právní
// náležitosti web potřebuje (identifikace, VOP, odstoupení, cookies, EAA).
//
// Nevyplněné pole = null → na to upozorní build (neblokující právní kontrola,
// viz integrations/legal-check.mjs). Web jede dál, ale hlásí, co chybí.
//
// Význam jednotlivých hodnot a celá logika jsou v docs/PRAVNI_CHECKLIST.md
// (tři osy: A právní forma, B typ prodeje, C cookies + EAA).
// Tady jsou JEN vstupní data — žádná pravidla. Pravidla = checklist.
// ════════════════════════════════════════════════════════════════

export const CLIENT_PROFILE = {
  // ── Osa A — právní forma (kdo klient je) ──
  // Určuje identifikační povinnost dle § 435 obč. zák. (viz checklist kap. 2 / osa A).
  // 'osvc-zr'   = OSVČ zapsaná v živnostenském rejstříku
  // 'osvc-jine' = OSVČ v jiné evidenci/komoře (advokát, lékař…)
  // 'sro' | 'as' | 'druzstvo'        = obchodní korporace (zápis v OR)
  // 'spolek' | 'nadace' | 'ustav'    = zápis ve veřejném rejstříku
  legalForm: null,        // 'osvc-zr' | 'osvc-jine' | 'sro' | 'as' | 'druzstvo' | 'spolek' | 'nadace' | 'ustav'

  // ── Osa B — typ prodeje (co klient prodává přes web, FAPI formuláře) ──
  // Každý typ má jiný režim odstoupení (viz checklist kap. 2 / osa B).
  // 'ne'           = čistě informační web (nic se neprodává)
  // 'digitalni'    = e-booky, online kurzy (odstoupení NE — jen při poučení § 1837)
  // 'terminovana'  = startovné, vstupenka na termín (odstoupení NE — § 1837)
  // 'prubezna'     = členství bez pevného termínu (odstoupení ANO, 14 dní)
  // 'zbozi'        = fyzické zboží (odstoupení ANO, 14 dní)
  // 'vyzaduje-pravni-posouzeni' = hraniční případ → ROZHODUJE ČLOVĚK, ne automat
  sellsOnline: null,      // 'ne' | 'digitalni' | 'terminovana' | 'prubezna' | 'zbozi' | 'vyzaduje-pravni-posouzeni'

  // ── Osa C — cookies / měření ──
  // 'jen-nezbytne' (default) = žádné měření, bez lišty
  // 'analytika' | 'marketing' = opt-in cookie lišta + podstránka o cookies
  usesCookies: 'jen-nezbytne',   // 'jen-nezbytne' | 'analytika' | 'marketing'

  // ── Formulář na webu ──
  // Je na webu poptávkový/kontaktní formulář (LeadForm)? Pokud ano → web
  // potřebuje podstránku Zásady zpracování osobních údajů.
  hasForm: null,          // true | false

  // ── EAA / přístupnost (zákon č. 424/2023 Sb., viz checklist kap. 6) ──
  // Výjimka mikropodnik platí, jen když jsou OBĚ podmínky true zároveň.
  employeesUnder10: null, // true | false — méně než 10 zaměstnanců (1. podmínka)
  turnoverUnder2M: null,  // true | false — roční obrat do 2 mil. EUR (2. podmínka)

  // ── Evidence přenosu odpovědnosti za VOP (viz checklist kap. 5.4) ──
  // 'hotovo'             = text dodán a vložen
  // 'klient-doda-pozdeji'= vědomé rozhodnutí, odpovědnost na klientovi (build hlásí informativně)
  // null                 = neřešeno (build hlásí jako chybějící)
  vopStatus: null,        // 'hotovo' | 'klient-doda-pozdeji' | null
} as const;
