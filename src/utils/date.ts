
export function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`);
}

export function formatIsoDateBR(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString('pt-BR');
}

export function parseBRDate(dateBR: string): Date | null {
  const parts = dateBR.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map((p) => parseInt(p, 10));
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}

export function calculateAgeInYears(birthDateBR: string, today: Date = new Date()): number | null {
  const birthDate = parseBRDate(birthDateBR);
  if (!birthDate) return null;
  let years = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (beforeBirthdayThisYear) years--;
  return Math.max(0, years);
}

export function formatAgeFromBirthDate(birthDateBR: string, today: Date = new Date()): string {
  const birthDate = birthDateBR.length >= 10 ? parseBRDate(birthDateBR) : null;
  if (!birthDate || birthDate > today) return '--';
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  if (years > 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return `${months} ${months === 1 ? 'mês' : 'meses'}`;
}

export function formatYears(age: number): string {
  return `${age} ${age === 1 ? 'ano' : 'anos'}`;
}

export function formatReminderDate(date: Date, now: Date = new Date()): string {
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / 86400000);
  if (diffDays === 0) return `Hoje às ${time}`;
  if (diffDays === 1) return `Amanhã às ${time}`;
  return `${date.toLocaleDateString('pt-BR')} às ${time}`;
}

export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'agora';
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `há ${diffHours} h`;
  if (diffHours < 48) return 'ontem';
  return date.toLocaleDateString('pt-BR');
}
