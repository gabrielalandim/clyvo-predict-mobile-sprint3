import { TipoEvento } from './HealthEvent';

export type CareReminderType = 'CONSULTA' | 'VACINA' | 'EXAME';

export interface CareReminderTypeConfig {
  value: CareReminderType;
  label: string;
  emoji: string;
  tipoEvento: TipoEvento;
}

export const CARE_REMINDER_TYPES: CareReminderTypeConfig[] = [
  { value: 'CONSULTA', label: 'Consulta', emoji: '🩺', tipoEvento: 'CONSULTA_ROTINA' },
  { value: 'VACINA', label: 'Vacina / reforço', emoji: '💉', tipoEvento: 'VACINA' },
  { value: 'EXAME', label: 'Exame', emoji: '🔬', tipoEvento: 'EXAME' },
];

export const getCareReminderType = (value: CareReminderType): CareReminderTypeConfig =>
  CARE_REMINDER_TYPES.find((t) => t.value === value) ?? CARE_REMINDER_TYPES[0];

export interface CareReminder {
  id: string;
  petId: string;
  petName: string;
  type: CareReminderType;
  scheduledFor: string;
}
