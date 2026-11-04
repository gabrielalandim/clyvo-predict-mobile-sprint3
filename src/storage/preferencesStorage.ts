import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_NOTIFICATION_PREFERENCES, NotificationPreferences } from '@models/AppNotification';

const NOTIFICATION_PREFS_KEY = '@clyvo:notification_prefs';

export const preferencesStorage = {
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const raw = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
      return raw ? { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_NOTIFICATION_PREFERENCES;
    } catch {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
  },
  async setNotificationPreferences(prefs: NotificationPreferences): Promise<void> {
    await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
  },
};
