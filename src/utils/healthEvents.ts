import { HealthEvent, isPreventiveEvent } from '@models/HealthEvent';

export interface EventsByCategory {
  vacinas: HealthEvent[];
  exames: HealthEvent[];
  consultas: HealthEvent[];
  outros: HealthEvent[];
}

export function groupEventsByCategory(events: HealthEvent[]): EventsByCategory {
  return {
    vacinas: events.filter((e) => e.tipoEvento === 'VACINA'),
    exames: events.filter((e) => e.tipoEvento === 'EXAME'),
    consultas: events.filter((e) => e.tipoEvento === 'CONSULTA_ROTINA'),
    outros: events.filter((e) => !isPreventiveEvent(e.tipoEvento)),
  };
}

export function preventivePercentage(events: HealthEvent[]): number {
  if (events.length === 0) return 0;
  const preventive = events.filter((e) => isPreventiveEvent(e.tipoEvento)).length;
  return Math.round((preventive / events.length) * 100);
}
