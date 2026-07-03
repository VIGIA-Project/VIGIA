/**
 * Utilidades de fecha para VIGIA.
 * Sin dependencias de framework - pura TypeScript.
 */

export function isWithinTimeRange(
  date: Date,
  startTime: string, // HH:mm
  endTime: string,   // HH:mm
): boolean {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const dateMinutes = date.getHours() * 60 + date.getMinutes();
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes <= endMinutes) {
    return dateMinutes >= startMinutes && dateMinutes <= endMinutes;
  }
  // Rango nocturno (ej: 22:00 - 06:00)
  return dateMinutes >= startMinutes || dateMinutes <= endMinutes;
}

export function formatDateToISO(date: Date): string {
  return date.toISOString();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isExpired(expirationDate: Date): boolean {
  return new Date() > expirationDate;
}

export function getDayOfWeek(date: Date): string {
  const days = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY',
    'THURSDAY', 'FRIDAY', 'SATURDAY',
  ];
  return days[date.getDay()];
}
