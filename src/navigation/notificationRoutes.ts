import { AppNotificationData } from '@models/AppNotification';
import { getCareReminderType } from '@models/CareReminder';
import { navigationRef } from './navigationRef';

export function openScreenForNotification(data: AppNotificationData): void {
  if (!navigationRef.isReady()) return;
  if (data.kind === 'care-reminder') {
    const config = getCareReminderType(data.reminderType);
    navigationRef.navigate('AddHealthEvent', {
      petId: data.petId,
      preset: { tipoEvento: config.tipoEvento, descricao: `${config.label} (lembrete agendado)` },
    });
    return;
  }
  navigationRef.navigate('PetDetails', { petId: data.petId });
}
