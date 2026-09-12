import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '@services/petService';
import { PetFormData } from '@models/Pet';

export const petKeys = {
  all: ['pets'] as const,
  detail: (id: string) => ['pets', id] as const,
};

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
    mutationFn: ({ form, tutorId }: { form: PetFormData; tutorId: number }) =>
      petService.createPet(form, tutorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form, tutorId }: { id: string; form: PetFormData; tutorId: number }) =>
      petService.updatePet(id, form, tutorId),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}

export function useAnalisarCadastro() {
  return useMutation({
    mutationFn: (photoUri: string) => petService.analisarCadastro(photoUri),
  });
}
