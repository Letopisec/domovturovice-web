// functions/api/lead.ts — Cloudflare Pages Function (žádný build krok).
// Přijímá { destination, fields } z formuláře, vybere adaptér podle destination
// a předá mu data + env. Token NIKDY necestuje z prohlížeče — drží se jen na serveru
// (context.env.FORM_TOKEN) a do cíle ho posílá až adaptér.

import { sheetsAdapter } from './adapters/sheetsAdapter';

interface Env {
  FORM_TOKEN?: string;
  SHEETS_WEBHOOK_URL?: string;
}

interface LeadPayload {
  destination?: string;
  fields?: Record<string, unknown>;
  zdroj?: string;
}

type Adapter = (fields: Record<string, unknown>, env: Env, zdroj: string) => Promise<{ ok: boolean; error?: string }>;

// Mapa cílů → adaptérů. Nový cíl = přidat řádek (a adaptér), ne novou komponentu.
const adapters: Record<string, Adapter> = {
  poptavka: sheetsAdapter,
  // newsletter: mailerAdapter,  // až bude potřeba
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request, env } = context;

  // 1) Parse JSON — chybný JSON nesmí shodit funkci.
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  const destination = payload?.destination;
  const fields = payload?.fields;
  const zdroj = typeof payload?.zdroj === 'string' ? payload.zdroj : '';

  if (!destination || typeof destination !== 'string') {
    return json({ ok: false, error: 'missing destination' }, 400);
  }
  if (!fields || typeof fields !== 'object') {
    return json({ ok: false, error: 'missing fields' }, 400);
  }

  // 2) Vyber adaptér.
  const adapter = adapters[destination];
  if (!adapter) {
    return json({ ok: false, error: 'unknown destination' }, 400);
  }

  // 3) Spusť adaptér. Jakákoli výjimka uvnitř se zachytí na čitelnou chybu.
  try {
    const result = await adapter(fields as Record<string, unknown>, env, zdroj);
    if (result.ok) {
      return json({ ok: true }, 200);
    }
    // 'not configured' = chybí env → 500; ostatní chyby adaptéru → 502 (selhání cíle).
    const status = result.error === 'not configured' ? 500 : 502;
    return json({ ok: false, error: result.error ?? 'send failed' }, status);
  } catch {
    return json({ ok: false, error: 'send failed' }, 502);
  }
};
