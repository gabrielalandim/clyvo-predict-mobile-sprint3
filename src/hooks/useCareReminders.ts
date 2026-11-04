import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CareReminder, CareReminderType, getCareReminderType } from '@models/CareReminder';
import {
  cancelScheduled,
  ensurePermission,
  listScheduled,
  NOTIFICATION_CHANNELS,
  parseNotificationData,
  scheduleAt,
} from '@services/notificationService';
import { preferencesStorage } from '@storage/preferencesStorage';
import { formatReminderDate } from '@utils/date';

export const careReminderKeys = {
  all: ['careReminders'] as const,
};

async function fetchReminders(): Promise<CareReminder[]> {
  const requests = await listScheduled();
  return requests
    .map((request) => {
      const data = parseNotificationData(request.content.data);
      if (data?.kind !== 'care-reminder') return null;
      return {
        id: request.identifier,
        petId: data.petId,
        petName: data.petName,
        type: data.reminderType,
        scheduledFor: data.scheduledFor,
      };
    })
    .filter((r): r is CareReminder => r !== null)
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
}

export function useCareReminders(petId?: string) {
  return useQuery({
    queryKey: careReminderKeys.all,
    queryFn: fetchReminders,
    select: (reminders) => (petId ? reminders.filter((r) => r.petId === petId) : reminders),
  });
}

export interface ScheduleReminderInput {
  petId: string;
  petName: string;
  type: CareReminderType;
  date: Date;
}

export function useScheduleCareReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ petId, petName, type, date }: ScheduleReminderInput) => {
      if (date.getTime() <= Date.now() + 30 * 1000) {
        throw new Error('Escolha um horário no futuro (pelo menos 1 minuto à frente).');
      }
      const prefs = await preferencesStorage.getNotificationPreferences();
      if (!prefs.careReminders) {
        throw new Error('Os lembretes de cuidados estão desativados. Ative em Perfil > Preferências.');
      }
      if (!(await ensurePermission())) {
        throw new Error('Permita as notificações do ClyvoPredict nas configurações do aparelho.');
      }
      const config = getCareReminderType(type);
      return scheduleAt({
        date,
        channelId: NOTIFICATION_CHANNELS.careReminders,
        title: `${config.emoji} Lembrete: ${config.label.toLowerCase()} do ${petName}`,
        body: `${formatReminderDate(date)}. Toque para registrar o cuidado no histórico de saúde.`,
        data: { kind: 'care-reminder', petId, petName, reminderType: type, scheduledFor: date.toISOString() },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: careReminderKeys.all }),
  });
}

export async function cancelRemindersForPet(petId: string): Promise<void> {
  const reminders = await fetchReminders();
  await Promise.all(reminders.filter((r) => r.petId === petId).map((r) => cancelScheduled(r.id)));
}

export function useCancelCareReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelScheduled,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: careReminderKeys.all }),
  });
}
