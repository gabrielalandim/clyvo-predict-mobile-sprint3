import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetNote } from '@models/PetNote';

const notesKey = (petId: string) => `@pet_notes_${petId}`;

async function readNotes(petId: string): Promise<PetNote[]> {
  const raw = await AsyncStorage.getItem(notesKey(petId));
  return raw ? (JSON.parse(raw) as PetNote[]) : [];
}

export const petNotesStorage = {
  list: readNotes,

  async add(petId: string, texto: string): Promise<PetNote> {
    const note: PetNote = {
      id: Date.now(),
      texto: texto.trim(),
      dataCriacao: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const notes = await readNotes(petId);
    await AsyncStorage.setItem(notesKey(petId), JSON.stringify([note, ...notes]));
    return note;
  },

  async remove(petId: string, noteId: number): Promise<void> {
    const notes = await readNotes(petId);
    await AsyncStorage.setItem(notesKey(petId), JSON.stringify(notes.filter((n) => n.id !== noteId)));
  },

  async removeAll(petId: string): Promise<void> {
    await AsyncStorage.removeItem(notesKey(petId));
  },
};
