import AsyncStorage from '@react-native-async-storage/async-storage';
import { TutorSession } from '@models/Auth';
const SESSION_KEY = '@clyvo:session';
export const sessionStorage = {
  async getSession(): Promise<TutorSession | null> {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as TutorSession) : null;
    } catch {
      return null;
    }
  },
  async saveSession(session: TutorSession): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
  async getToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.token ?? null;
  },
};
