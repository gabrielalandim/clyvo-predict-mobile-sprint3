import { useState } from 'react';
import { Pet } from '@models/Pet';
import { groupEventsByCategory } from '@utils/healthEvents';
import { generateAndSharePetPdf } from '@utils/petPdf';
import { usePets } from './usePets';
import { useHealthEvents } from './useHealthEvents';

export function usePetWallet(initialPetId?: string) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId ?? null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const { data: pets = [], isLoading, error: petsError } = usePets();
  const currentPet: Pet | null = pets.find((p) => p.id === selectedPetId) ?? pets[0] ?? null;
  const { data: events = [], isLoading: loadingEvents, error: eventsError } = useHealthEvents(currentPet?.id);

  const generatePdf = async (): Promise<string | null> => {
    if (!currentPet) return null;
    setGeneratingPdf(true);
    try {
      await generateAndSharePetPdf(currentPet, events);
      return null;
    } catch (error) {
      return (error as Error).message ?? 'Não foi possível gerar o PDF agora.';
    } finally {
      setGeneratingPdf(false);
    }
  };

  return {
    pets,
    isLoading,
    loadingEvents,
    petsError,
    eventsError,
    currentPet,
    selectPet: (pet: Pet) => setSelectedPetId(pet.id),
    eventsByCategory: groupEventsByCategory(events),
    generatingPdf,
    generatePdf,
  };
}
