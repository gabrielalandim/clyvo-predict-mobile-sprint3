import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthEventService } from '@services/healthEventService';
import { TipoEvento } from '@models/HealthEvent';
import { petKeys } from './usePets';

export const healthEventKeys = {
  byPet: (petId: string) => ['healthEvents', petId] as const,
};

export function useHealthEvents(petId: string | undefined) {
  return useQuery({
    queryKey: healthEventKeys.byPet(petId ?? ''),
    queryFn: () => healthEventService.listByPet(petId as string),
    enabled: !!petId,
  });
}

interface CreateEventInput {
  petId: string;
  tipoEvento: TipoEvento;
  descricao: string;
  dataEvento: string;
}

export function useCreateHealthEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ petId, tipoEvento, descricao, dataEvento }: CreateEventInput) =>
      healthEventService.create(petId, tipoEvento, descricao, dataEvento),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthEventKeys.byPet(variables.petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.detail(variables.petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}

interface UpdateEventInput extends CreateEventInput {
  id: string;
}

export function useUpdateHealthEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, petId, tipoEvento, descricao, dataEvento }: UpdateEventInput) =>
      healthEventService.update(id, petId, tipoEvento, descricao, dataEvento),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthEventKeys.byPet(variables.petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.detail(variables.petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}

export function useDeleteHealthEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; petId: string }) => healthEventService.remove(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: healthEventKeys.byPet(variables.petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.detail(variables.petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}
