import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthEventService } from '@services/healthEventService';
import { TipoEvento } from '@models/HealthEvent';
import { petService } from '@services/petService';
import { petKeys } from './petKeys';
import { PetScoreSnapshot, useScoreAlerts } from './useScoreAlerts';

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

function invalidatePetData(queryClient: ReturnType<typeof useQueryClient>, petId: string) {
  queryClient.invalidateQueries({ queryKey: healthEventKeys.byPet(petId) });
  queryClient.invalidateQueries({ queryKey: petKeys.detail(petId) });
  queryClient.invalidateQueries({ queryKey: petKeys.all });
}

type ScoreContext = { before: PetScoreSnapshot | null };

export function useCreateHealthEvent() {
  const queryClient = useQueryClient();
  const { snapshot, notifyScoreChange } = useScoreAlerts();
  return useMutation({
    onMutate: async (variables: CreateEventInput): Promise<ScoreContext> => ({ before: await snapshot(variables.petId) }),
    mutationFn: ({ petId, tipoEvento, descricao, dataEvento }: CreateEventInput) =>
      healthEventService.create(petId, tipoEvento, descricao, dataEvento),
    onSuccess: (event, variables, context) => {
      invalidatePetData(queryClient, variables.petId);
      notifyScoreChange(context?.before, event.petHealthScore);
    },
  });
}

interface UpdateEventInput extends CreateEventInput {
  id: string;
}

export function useUpdateHealthEvent() {
  const queryClient = useQueryClient();
  const { snapshot, notifyScoreChange } = useScoreAlerts();
  return useMutation({
    onMutate: async (variables: UpdateEventInput): Promise<ScoreContext> => ({ before: await snapshot(variables.petId) }),
    mutationFn: ({ id, petId, tipoEvento, descricao, dataEvento }: UpdateEventInput) =>
      healthEventService.update(id, petId, tipoEvento, descricao, dataEvento),
    onSuccess: (event, variables, context) => {
      invalidatePetData(queryClient, variables.petId);
      notifyScoreChange(context?.before, event.petHealthScore);
    },
  });
}

interface DeleteEventInput {
  id: string;
  petId: string;
}

export function useDeleteHealthEvent() {
  const queryClient = useQueryClient();
  const { snapshot, notifyScoreChange } = useScoreAlerts();
  return useMutation({
    onMutate: async (variables: DeleteEventInput): Promise<ScoreContext> => ({ before: await snapshot(variables.petId) }),
    mutationFn: async ({ id, petId }: DeleteEventInput) => {
      await healthEventService.remove(id);
      return petService.getPet(petId);
    },
    onSuccess: (pet, variables, context) => {
      invalidatePetData(queryClient, variables.petId);
      notifyScoreChange(context?.before, pet.score);
    },
  });
}
