// Převod českého názvu na URL slug (diakritika → ASCII, mezery → pomlčky)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // odstranit diakritiku
    .replace(/[^a-z0-9]+/g, '-')                       // nealfanum → pomlčka
    .replace(/^-+|-+$/g, '');                          // ořez pomlček
}
