import { HealthEvent, isPreventiveEvent, TipoEvento } from '@models/HealthEvent';
import { parseIsoDate } from './date';
import { clampScore } from './score';

export type HistoryPeriod = '1m' | '3m' | '6m';

export const HISTORY_PERIODS: { key: HistoryPeriod; label: string; months: number }[] = [
  { key: '1m', label: '1 mês', months: 1 },
  { key: '3m', label: '3 meses', months: 3 },
  { key: '6m', label: '6 meses', months: 6 },
];

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
export const CHART_MONTHS_BACK = 6;

export function filterEventsByPeriod(events: HealthEvent[], period: HistoryPeriod, now: Date = new Date()) {
  const months = HISTORY_PERIODS.find((p) => p.key === period)?.months ?? 6;
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - months);
  return events.filter((e) => parseIsoDate(e.dataEvento) >= cutoff);
}

export function sumScoreDelta(events: HealthEvent[]): number {
  return events.reduce((acc, e) => acc + e.deltaScore, 0);
}

export function buildMonthlyScoreChart(events: HealthEvent[], currentScore: number, now: Date = new Date()) {
  const points: number[] = [];
  for (let i = CHART_MONTHS_BACK; i >= 0; i--) {
    const boundary = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const laterEvents = events.filter((e) => parseIsoDate(e.dataEvento) >= boundary);
    points.push(clampScore(currentScore - sumScoreDelta(laterEvents)));
  }
  const months = Array.from({ length: CHART_MONTHS_BACK + 1 }, (_, i) => {
    const idx = (now.getMonth() - CHART_MONTHS_BACK + i + 12) % 12;
    return MONTH_LABELS[idx];
  });
  return {
    points,
    months,
    max: Math.max(...points),
    min: Math.max(0, Math.min(...points) - 5),
  };
}

export function buildEventBreakdown(events: HealthEvent[]) {
  const countByType = (type: TipoEvento) => events.filter((e) => e.tipoEvento === type).length;
  const items = [
    { label: 'Vacinas', icon: '💉', count: countByType('VACINA') },
    { label: 'Exames', icon: '🔬', count: countByType('EXAME') },
    { label: 'Consultas', icon: '🩺', count: countByType('CONSULTA_ROTINA') },
    { label: 'Ocorrências', icon: '⚠️', count: events.filter((e) => !isPreventiveEvent(e.tipoEvento)).length },
  ];
  const total = events.length;
  return items.map((item) => ({ ...item, pct: total > 0 ? Math.round((item.count / total) * 100) : 0 }));
}
