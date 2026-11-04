export type TipoEvento =
  | 'VACINA'
  | 'CONSULTA_ROTINA'
  | 'EXAME'
  | 'DOENCA_LEVE'
  | 'CIRURGIA'
  | 'DOENCA_GRAVE'
  | 'ACIDENTE'
  | 'RELATO_SINTOMA'
  | 'ALTERACAO_COMPORTAMENTO';
export interface EventTypeConfig {
  value: TipoEvento;
  label: string;
  icon: string;
  emoji: string;
  impactoScore: number;
  preventivo: boolean;
}
export const EVENT_TYPES: EventTypeConfig[] = [
  { value: 'VACINA', label: 'Vacina', icon: 'shield-checkmark', emoji: '💉', impactoScore: 10, preventivo: true },
  { value: 'CONSULTA_ROTINA', label: 'Consulta de rotina', icon: 'medical', emoji: '🩺', impactoScore: 5, preventivo: true },
  { value: 'EXAME', label: 'Exame', icon: 'document-text', emoji: '🔬', impactoScore: 5, preventivo: true },
  { value: 'RELATO_SINTOMA', label: 'Relato de sintoma', icon: 'pulse', emoji: '🤧', impactoScore: -5, preventivo: false },
  {
    value: 'ALTERACAO_COMPORTAMENTO',
    label: 'Mudança de comportamento',
    icon: 'happy-outline',
    emoji: '🐾',
    impactoScore: -5,
    preventivo: false,
  },
  { value: 'DOENCA_LEVE', label: 'Doença leve', icon: 'thermometer', emoji: '🤒', impactoScore: -15, preventivo: false },
  { value: 'CIRURGIA', label: 'Cirurgia', icon: 'cut', emoji: '🏥', impactoScore: -30, preventivo: false },
  { value: 'DOENCA_GRAVE', label: 'Doença grave', icon: 'warning', emoji: '🚨', impactoScore: -40, preventivo: false },
  { value: 'ACIDENTE', label: 'Acidente', icon: 'alert-circle', emoji: '⚠️', impactoScore: -50, preventivo: false },
];
export const isPreventiveEvent = (tipo: TipoEvento): boolean => getEventTypeConfig(tipo).preventivo;
export const getEventTypeConfig = (tipo: TipoEvento): EventTypeConfig =>
  EVENT_TYPES.find((t) => t.value === tipo) ?? EVENT_TYPES[0];
export interface HealthEventApiDTO {
  id: number;
  petId: number;
  tipoEvento: TipoEvento;
  descricao: string;
  dataEvento: string;
  novoHealthScore: number;
}
export interface HealthEvent {
  id: string;
  petId: string;
  tipoEvento: TipoEvento;
  descricao: string;
  dataEvento: string;
  deltaScore: number;
  petHealthScore: number;
}
