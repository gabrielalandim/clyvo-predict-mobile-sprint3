import { useEffect, useMemo, useState } from 'react';
import { usePets } from './usePets';
import { useHealthEvents } from './useHealthEvents';
import {
  buildEventBreakdown,
  buildMonthlyScoreChart,
  filterEventsByPeriod,
  HistoryPeriod,
  sumScoreDelta,
} from '@utils/scoreHistory';

export function usePetScoreHistory(initialPetId?: string) {
  const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId ?? '');
  const [period, setPeriod] = useState<HistoryPeriod>('6m');

  const { data: pets = [], isLoading, error: petsError } = usePets();
  const { data: events = [], error: eventsError } = useHealthEvents(selectedPetId || undefined);

  useEffect(() => {
    if (pets.length > 0 && !pets.some((p) => p.id === selectedPetId)) setSelectedPetId(pets[0].id);
  }, [pets, selectedPetId]);

  const currentPet = pets.find((p) => p.id === selectedPetId);
  const currentScore = currentPet?.score ?? 0;

  const filteredEvents = useMemo(() => filterEventsByPeriod(events, period), [events, period]);
  const chart = useMemo(() => buildMonthlyScoreChart(events, currentScore), [events, currentScore]);
  const breakdown = useMemo(() => buildEventBreakdown(filteredEvents), [filteredEvents]);

  return {
    pets,
    isLoading,
    petsError,
    eventsError,
    selectedPetId,
    setSelectedPetId,
    currentPet,
    currentScore,
    period,
    setPeriod,
    filteredEvents,
    periodDelta: sumScoreDelta(filteredEvents),
    chart,
    breakdown,
  };
}
