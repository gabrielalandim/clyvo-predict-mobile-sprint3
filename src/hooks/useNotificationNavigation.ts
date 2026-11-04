import { useCallback, useEffect, useRef } from 'react';
import { AppNotificationData } from '@models/AppNotification';
import { navigationRef } from '@navigation/navigationRef';
import {
  configureNotificationHandler,
  consumeLaunchNotification,
  createAndroidChannels,
  ensurePermission,
  onNotificationTapped,
} from '@services/notificationService';

configureNotificationHandler();

function openScreenFor(data: AppNotificationData) {
  navigationRef.navigate('PetDetails', { petId: data.petId });
}

export function useNotificationNavigation(isLoggedIn: boolean) {
  const pending = useRef<AppNotificationData | null>(null);

  const flushPending = useCallback(() => {
    if (!pending.current || !isLoggedIn || !navigationRef.isReady()) return;
    const data = pending.current;
    pending.current = null;
    openScreenFor(data);
  }, [isLoggedIn]);

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
    const subscription = onNotificationTapped((data) => {
      pending.current = data;
      flushPending();
    });
    return () => subscription.remove();
  }, [flushPending]);

  useEffect(() => {
    if (!isLoggedIn) return;
    ensurePermission().catch(() => undefined);
    flushPending();
  }, [isLoggedIn, flushPending]);

  return { onNavigationReady: flushPending };
}
