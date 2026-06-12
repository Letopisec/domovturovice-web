// functions/api/adapters/sheetsAdapter.ts
// Adaptér pro Google Sheets přes Apps Script webhook.
// Dostane (fields, env), pošle POST JSON na env.SHEETS_WEBHOOK_URL s tokenem z env.FORM_TOKEN.
//
// KONTRAKT názvů polí (Apps Script je čte pod stejnými klíči):
//   jmeno, telefon, email, zprava, zdroj  (zdroj = cesta+query stránky odeslání)
// Pole z jiných presetů (např. newsletter) tento adaptér ignoruje — ta řeší jiný adaptér.

interface Env {
  FORM_TOKEN?: string;
  SHEETS_WEBHOOK_URL?: string;
}

export async function sheetsAdapter(
  fields: Record<string, unknown>,
  env: Env,
  zdroj: string = ''
): Promise<{ ok: boolean; error?: string }> {
  // Bez konfigurace nepokračuj — čitelná chyba, žádná výjimka.
  if (!env.SHEETS_WEBHOOK_URL || !env.FORM_TOKEN) {
    return { ok: false, error: 'not configured' };
  }

  const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));

  const body = {
    token: env.FORM_TOKEN,
    jmeno: str(fields.jmeno),
    telefon: str(fields.telefon),
    email: str(fields.email),
    zprava: str(fields.zprava),
    zdroj: str(zdroj),
  };

  try {
    const res = await fetch(env.SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { ok: false, error: 'sheets error' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'sheets unreachable' };
  }
}
