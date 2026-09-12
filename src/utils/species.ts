import { Species } from '@constants/races';
export function normalizeSpecies(raw: string | null | undefined): Species {
  const value = (raw ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
  if (['dog', 'cao', 'cachorro', 'canino'].includes(value)) return 'dog';
  if (['cat', 'gato', 'felino'].includes(value)) return 'cat';
  return 'other';
}
export function speciesToApiLabel(species: Species): string {
  switch (species) {
    case 'dog':
      return 'Cão';
    case 'cat':
      return 'Gato';
    default:
      return 'Outro';
  }
}
