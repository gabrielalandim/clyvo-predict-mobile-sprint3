import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { AppNotificationData, InboxNotification } from '@models/AppNotification';
import { navigationRef } from '@navigation/navigationRef';
import { openScreenForNotification } from '@navigation/notificationRoutes';
import {
  configureNotificationHandler,
  consumeLaunchNotification,
  createAndroidChannels,
  ensurePermission,
  listPresented,
  onNotificationReceived,
  onNotificationTapped,
} from '@services/notificationService';
import { notificationInboxStorage } from '@storage/notificationInboxStorage';
import { notificationInboxKey } from './useNotificationInbox';
import { careReminderKeys } from './useCareReminders';

configureNotificationHandler();

export function useNotificationNavigation(isLoggedIn: boolean) {
  const queryClient = useQueryClient();
  const pending = useRef<AppNotificationData | null>(null);

  const flushPending = useCallback(() => {
    if (!pending.current || !isLoggedIn || !navigationRef.isReady()) return;
    const data = pending.current;
    pending.current = null;
    openScreenForNotification(data);
  }, [isLoggedIn]);

  const saveToInbox = useCallback(
    async (items: Omit<InboxNotification, 'read'>[]) => {
      for (const item of items) await notificationInboxStorage.add(item);
      queryClient.invalidateQueries({ queryKey: notificationInboxKey });
      queryClient.invalidateQueries({ queryKey: careReminderKeys.all });
    },
    [queryClient],
  );

  useEffect(() => {
    createAndroidChannels().catch(() => undefined);
    consumeLaunchNotification()
      .then((data) => {
        if (data) {
          pending.current = data;
          flushPending();
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const syncPresented = () => listPresented().then(saveToInbox).catch(() => undefined);
    syncPresented();
    const received = onNotificationReceived((item) => saveToInbox([item]));
    const appState = AppState.addEventListener('change', (state) => state === 'active' && syncPresented());
    return () => {
      received.remove();
      appState.remove();
    };
  }, [saveToInbox]);

  useEffect(() => {
    const tapped = onNotificationTapped((data, item) => {
      if (item) saveToInbox([item]);
      pending.current = data;
      flushPending();
    });
    return () => tapped.remove();
  }, [flushPending, saveToInbox]);

  useEffect(() => {
    if (!isLoggedIn) return;
    ensurePermission().catch(() => undefined);
    flushPending();
  }, [isLoggedIn, flushPending]);

  return { onNavigationReady: flushPending };
}
