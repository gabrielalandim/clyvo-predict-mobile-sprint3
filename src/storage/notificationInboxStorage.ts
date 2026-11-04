import AsyncStorage from '@react-native-async-storage/async-storage';
import { InboxNotification } from '@models/AppNotification';

const INBOX_KEY = '@clyvo:notification_inbox';
const MAX_ITEMS = 50;

async function readInbox(): Promise<InboxNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(INBOX_KEY);
    return raw ? (JSON.parse(raw) as InboxNotification[]) : [];
  } catch {
    return [];
  }
}

async function writeInbox(items: InboxNotification[]): Promise<void> {
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export const notificationInboxStorage = {
  list: readInbox,

  async add(item: Omit<InboxNotification, 'read'>): Promise<boolean> {
    const items = await readInbox();
    if (items.some((i) => i.id === item.id)) return false;
    const next = [{ ...item, read: false }, ...items].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
    await writeInbox(next);
    return true;
  },

  async markAllRead(): Promise<void> {
    const items = await readInbox();
    if (items.every((i) => i.read)) return;
    await writeInbox(items.map((i) => ({ ...i, read: true })));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(INBOX_KEY);
  },
};
