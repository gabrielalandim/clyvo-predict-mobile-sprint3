import { Alert, Linking } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_NOTIFICATION_PREFERENCES, NotificationPreferences } from '@models/AppNotification';
import { preferencesStorage } from '@storage/preferencesStorage';
import { ensurePermission } from '@services/notificationService';

export const notificationPrefsKey = ['notificationPreferences'] as const;

export function useNotificationPreferences() {
  const queryClient = useQueryClient();
  const { data: preferences = DEFAULT_NOTIFICATION_PREFERENCES } = useQuery({
    queryKey: notificationPrefsKey,
    queryFn: preferencesStorage.getNotificationPreferences,
  });

  const save = useMutation({
    mutationFn: preferencesStorage.setNotificationPreferences,
    onMutate: (next) => queryClient.setQueryData(notificationPrefsKey, next),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationPrefsKey }),
  });

  const setPreference = async (key: keyof NotificationPreferences, enabled: boolean) => {
    if (enabled && !(await ensurePermission())) {
      Alert.alert(
        'Notificações bloqueadas',
        'Para receber alertas do ClyvoPredict, permita as notificações nas configurações do aparelho.',
        [
          { text: 'Agora não', style: 'cancel' },
          { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    save.mutate({ ...preferences, [key]: enabled });
  };

  return { preferences, setPreference };
}
