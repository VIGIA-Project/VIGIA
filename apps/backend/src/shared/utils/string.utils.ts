/**
 * Utilidades de string para VIGIA.
 */

export function normalizeLicensePlate(plate: string): string {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function maskString(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) return value;
  return '*'.repeat(value.length - visibleChars) + value.slice(-visibleChars);
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
