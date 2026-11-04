import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AppNotificationData } from '@models/AppNotification';


export const NOTIFICATION_CHANNELS = {
  healthAlerts: 'health-alerts',
  careReminders: 'care-reminders',
} as const;

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function createAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.healthAlerts, {
    name: 'Alertas de saúde',
    description: 'Avisos quando o Score de Saúde do pet muda de faixa',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#289fce',
  });
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.careReminders, {
    name: 'Lembretes de cuidados',
    description: 'Consultas, vacinas e vermífugos agendados pelo tutor',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#126ca8',
  });
}

export async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

interface LocalNotificationInput {
  title: string;
  body: string;
  data: AppNotificationData;
  channelId: string;
}

export async function presentNow({ title, body, data, channelId }: LocalNotificationInput): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data: data as unknown as Record<string, unknown>, sound: 'default' },
    trigger: Platform.OS === 'android' ? { channelId } : null,
  });
}

export async function scheduleAt(input: LocalNotificationInput & { date: Date }): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title: input.title, body: input.body, data: input.data as unknown as Record<string, unknown>, sound: 'default' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: input.date, channelId: input.channelId },
  });
}

export async function listScheduled(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

export async function cancelScheduled(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllScheduled(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function parseNotificationData(data: unknown): AppNotificationData | null {
  const value = data as Partial<AppNotificationData> | undefined;
  if (!value || typeof value.petId !== 'string') return null;
  if (value.kind === 'score-alert' || value.kind === 'care-reminder') return value as AppNotificationData;
  return null;
}

export function onNotificationTapped(listener: (data: AppNotificationData) => void) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = parseNotificationData(response.notification.request.content.data);
    if (data) listener(data);
  });
}

export async function consumeLaunchNotification(): Promise<AppNotificationData | null> {
  const response = await Notifications.getLastNotificationResponseAsync();
  if (!response) return null;
  await Notifications.clearLastNotificationResponseAsync();
  return parseNotificationData(response.notification.request.content.data);
}
