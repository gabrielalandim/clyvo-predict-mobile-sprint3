import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_NOTIFICATION_PREFERENCES, NotificationPreferences } from '@models/AppNotification';

const DARK_MODE_KEY = '@clyvo:dark_mode';
const NOTIFICATION_PREFS_KEY = '@clyvo:notification_prefs';

export const preferencesStorage = {
  async getDarkMode(): Promise<boolean | null> {
    try {
      const saved = await AsyncStorage.getItem(DARK_MODE_KEY);
      return saved === null ? null : saved === 'true';
    } catch {
      return null;
    }
  },
  async setDarkMode(isDark: boolean): Promise<void> {
    await AsyncStorage.setItem(DARK_MODE_KEY, String(isDark)).catch(() => undefined);
  },
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
