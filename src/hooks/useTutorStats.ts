import { useQueries } from '@tanstack/react-query';
import { healthEventService } from '@services/healthEventService';
import { healthEventKeys } from './useHealthEvents';
import { usePets } from './usePets';

export function useTutorStats() {
  const { data: pets = [] } = usePets();
  const eventQueries = useQueries({
    queries: pets.map((pet) => ({
      queryKey: healthEventKeys.byPet(pet.id),
      queryFn: () => healthEventService.listByPet(pet.id),
    })),
  });
  return {
    petCount: pets.length,
    eventCount: eventQueries.reduce((total, q) => total + (q.data?.length ?? 0), 0),
  };
}
