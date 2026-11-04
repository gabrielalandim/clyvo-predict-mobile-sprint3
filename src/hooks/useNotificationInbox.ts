import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationInboxStorage } from '@storage/notificationInboxStorage';

export const notificationInboxKey = ['notificationInbox'] as const;

export function useNotificationInbox() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: notificationInboxKey });
  const { data: notifications = [], refetch } = useQuery({
    queryKey: notificationInboxKey,
    queryFn: notificationInboxStorage.list,
  });
  const markAllRead = useMutation({ mutationFn: notificationInboxStorage.markAllRead, onSuccess: invalidate });
  const clear = useMutation({ mutationFn: notificationInboxStorage.clear, onSuccess: invalidate });

  const { mutate: mutateMarkAllRead } = markAllRead;
  const { mutate: mutateClear } = clear;
  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    refetch,
    markAllRead: useCallback(() => mutateMarkAllRead(), [mutateMarkAllRead]),
    clear: useCallback(() => mutateClear(), [mutateClear]),
  };
}
