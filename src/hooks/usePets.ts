import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '@services/petService';
import { PetFormData } from '@models/Pet';

import { petKeys } from './petKeys';
import { cancelRemindersForPet, careReminderKeys } from './useCareReminders';

export { petKeys };

export function usePets() {
  return useQuery({
    queryKey: petKeys.all,
    queryFn: () => petService.listPets(),
  });
}

export function usePet(petId: string | undefined) {
  return useQuery({
    queryKey: petKeys.detail(petId ?? ''),
    queryFn: () => petService.getPet(petId as string),
    enabled: !!petId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: PetFormData) => petService.createPet(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: PetFormData }) => petService.updatePet(id, form),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      queryClient.invalidateQueries({ queryKey: petKeys.detail(variables.id) });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: async (_data, id) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      await cancelRemindersForPet(id).catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: careReminderKeys.all });
    },
  });
}

export function useAnalisarCadastro() {
  return useMutation({
    mutationFn: (photoUri: string) => petService.analisarCadastro(photoUri),
  });
}
