import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetLocalExtras } from '@models/Pet';
const EXTRAS_KEY = '@clyvo:pet_extras';
const NOTES_KEY_PREFIX = '@pet_notes_';
async function getAllExtras(): Promise<Record<string, PetLocalExtras>> {
  try {
    const raw = await AsyncStorage.getItem(EXTRAS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
export const petExtrasStorage = {
  async getExtras(petId: string): Promise<PetLocalExtras> {
    const all = await getAllExtras();
    return all[petId] ?? {};
  },
  async saveExtras(petId: string, extras: PetLocalExtras): Promise<void> {
    const all = await getAllExtras();
    all[petId] = { ...all[petId], ...extras };
    await AsyncStorage.setItem(EXTRAS_KEY, JSON.stringify(all));
  },
  async deleteExtras(petId: string): Promise<void> {
    const all = await getAllExtras();
    delete all[petId];
    await AsyncStorage.setItem(EXTRAS_KEY, JSON.stringify(all));
    await AsyncStorage.removeItem(`${NOTES_KEY_PREFIX}${petId}`);
  },
};
