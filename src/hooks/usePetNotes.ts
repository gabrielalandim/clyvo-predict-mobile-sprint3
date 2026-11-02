import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { petNotesStorage } from '@storage/petNotesStorage';

export const petNoteKeys = {
  byPet: (petId: string) => ['petNotes', petId] as const,
};

export function usePetNotes(petId: string) {
  const queryClient = useQueryClient();
  const queryKey = petNoteKeys.byPet(petId);
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const notesQuery = useQuery({ queryKey, queryFn: () => petNotesStorage.list(petId) });
  const addNote = useMutation({ mutationFn: (texto: string) => petNotesStorage.add(petId, texto), onSuccess: invalidate });
  const removeNote = useMutation({
    mutationFn: (noteId: number) => petNotesStorage.remove(petId, noteId),
    onSuccess: invalidate,
  });

  return {
    notes: notesQuery.data ?? [],
    addNote: addNote.mutateAsync,
    removeNote: removeNote.mutateAsync,
    saving: addNote.isPending,
  };
}
