import { TipoEvento } from './HealthEvent';

export type AppNotificationData =
  | { kind: 'score-alert'; petId: string }
  | { kind: 'care-reminder'; petId: string; tipoEvento: TipoEvento; reminderLabel: string };

export interface NotificationPreferences {
  healthAlerts: boolean;
  careReminders: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  healthAlerts: true,
  careReminders: true,
};
