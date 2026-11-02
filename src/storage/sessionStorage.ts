import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TutorSession } from '@models/Auth';

const SESSION_KEY = 'clyvo.session';
const LEGACY_ASYNC_STORAGE_KEY = '@clyvo:session';

const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const isWeb = Platform.OS === 'web';
let webMemorySession: string | null = null;

async function readRaw(): Promise<string | null> {
  if (isWeb) return webMemorySession;
  return SecureStore.getItemAsync(SESSION_KEY, SECURE_OPTIONS);
}

async function writeRaw(value: string): Promise<void> {
  if (isWeb) {
    webMemorySession = value;
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, value, SECURE_OPTIONS);
}

async function deleteRaw(): Promise<void> {
  if (isWeb) {
    webMemorySession = null;
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY, SECURE_OPTIONS);
}

async function migrateLegacySession(): Promise<string | null> {
  try {
    const legacy = await AsyncStorage.getItem(LEGACY_ASYNC_STORAGE_KEY);
    if (!legacy) return null;
    await writeRaw(legacy);
    await AsyncStorage.removeItem(LEGACY_ASYNC_STORAGE_KEY);
    return legacy;
  } catch {
    return null;
  }
}

export const sessionStorage = {
  async getSession(): Promise<TutorSession | null> {
    try {
      const raw = (await readRaw()) ?? (await migrateLegacySession());
      return raw ? (JSON.parse(raw) as TutorSession) : null;
    } catch {
      return null;
    }
  },
  async saveSession(session: TutorSession): Promise<void> {
    await writeRaw(JSON.stringify(session));
  },
  async clearSession(): Promise<void> {
    await deleteRaw();
    await AsyncStorage.removeItem(LEGACY_ASYNC_STORAGE_KEY).catch(() => undefined);
  },
  async getToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.token ?? null;
  },
};
