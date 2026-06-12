// formPresets.ts — datové definice formulářových polí (žádný markup).
// Komponenta LeadForm renderuje pole podle těchto definic; preset se volí propem `variant`.
// Nový druh formuláře = nový preset zde, ne nová komponenta.

export type FieldType = 'text' | 'tel' | 'email' | 'textarea' | 'select' | 'checkbox';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autocomplete?: string;
  options?: FieldOption[]; // jen pro type 'select'
}

export const formPresets: Record<string, FieldDef[]> = {
  // Poptávka konzultace — hlavní formulář webu (cíl 'poptavka' → sheetsAdapter).
  konzultace: [
    { type: 'text', name: 'jmeno', label: 'Jméno', placeholder: 'Jméno', required: true, autocomplete: 'name' },
    { type: 'tel', name: 'telefon', label: 'Telefon', placeholder: 'Telefon', required: true, autocomplete: 'tel' },
    { type: 'email', name: 'email', label: 'E-mail', placeholder: 'E-mail', required: true, autocomplete: 'email' },
    { type: 'textarea', name: 'zprava', label: 'Zpráva', placeholder: 'Stručně k vašemu domu a tomu, co řešíte (nepovinné)' },
  ],

  // Newsletter — odběr novinek.
  // POZN.: checkbox souhlasu je POVINNÝ kvůli GDPR (purpose) — bez prokazatelného
  // souhlasu nesmíme novinky zasílat, proto required: true.
  newsletter: [
    { type: 'text', name: 'jmeno', label: 'Jméno', placeholder: 'Jméno' },
    { type: 'email', name: 'email', label: 'E-mail', placeholder: 'E-mail', required: true, autocomplete: 'email' },
    {
      type: 'checkbox',
      name: 'souhlas',
      label: 'Souhlasím se zpracováním e-mailové adresy za účelem zasílání novinek. Souhlas mohu kdykoli odvolat.',
      required: true,
    },
  ],
};

export type PresetKey = keyof typeof formPresets;
