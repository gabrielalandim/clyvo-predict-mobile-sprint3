import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { Pet } from '@models/Pet';
import { petService } from '@services/petService';
import { NOTIFICATION_CHANNELS, presentNow } from '@services/notificationService';
import { preferencesStorage } from '@storage/preferencesStorage';
import { buildScoreAlert } from '@utils/scoreAlerts';
import { petKeys } from './petKeys';

export interface PetScoreSnapshot {
  petId: string;
  name: string;
  score: number;
}

export async function getPetSnapshot(queryClient: QueryClient, petId: string): Promise<PetScoreSnapshot | null> {
  const cached =
    queryClient.getQueryData<Pet>(petKeys.detail(petId)) ??
    queryClient.getQueryData<Pet[]>(petKeys.all)?.find((p) => p.id === petId);
  try {
    const pet = cached ?? (await petService.getPet(petId));
    return { petId, name: pet.name, score: pet.score };
  } catch {
    return null;
  }
}

export function useScoreAlerts() {
  const queryClient = useQueryClient();

  const notifyScoreChange = async (before: PetScoreSnapshot | null | undefined, newScore: number) => {
    if (!before) return;
    const alert = buildScoreAlert(before.name, before.score, newScore);
    if (!alert) return;
    const prefs = await preferencesStorage.getNotificationPreferences();
    if (!prefs.healthAlerts) return;
    await presentNow({
      ...alert,
      channelId: NOTIFICATION_CHANNELS.healthAlerts,
      data: { kind: 'score-alert', petId: before.petId },
    }).catch(() => undefined);
  };

  return {
    snapshot: (petId: string) => getPetSnapshot(queryClient, petId),
    notifyScoreChange,
  };
}
