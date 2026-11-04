export function maskDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}
export function isValidDateInput(dateStr: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr);
  if (!match) return false;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
export function toIsoDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}
export function fromIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
export function maskTimeInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}
export function isValidTimeInput(timeStr: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(timeStr);
  if (!match) return false;
  return parseInt(match[1], 10) <= 23 && parseInt(match[2], 10) <= 59;
}
export function toDateTime(dateStr: string, timeStr: string): Date {
  const [day, month, year] = dateStr.split('/').map((p) => parseInt(p, 10));
  const [hours, minutes] = timeStr.split(':').map((p) => parseInt(p, 10));
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}
