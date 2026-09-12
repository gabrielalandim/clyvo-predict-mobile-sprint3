export type Species = 'dog' | 'cat' | 'other';
export const RACES_BY_SPECIES: Record<Species, string[]> = {
  dog: ['Golden Retriever', 'Vira-lata (SRD)', 'Pastor Alemão', 'Bulldog', 'Labrador', 'Pinscher'],
  cat: ['Persa', 'Siamês', 'Vira-lata (SRD)', 'Maine Coon', 'Angorá', 'Ragdoll'],
  other: ['Calopsita', 'Coelho Netherland', 'Hamster Sírio', 'Porquinho da Índia', 'Ferret', 'Chinchila'],
};
export const BREED_ICONS: Record<Species, Record<string, string>> = {
  dog: {
    'Golden Retriever': '🦮',
    'Vira-lata (SRD)': '🐕',
    'Pastor Alemão': '🐺',
    Bulldog: '🐾',
    Labrador: '🦮',
    Pinscher: '🐕',
  },
  cat: {
    Persa: '🐱',
    Siamês: '🐱',
    'Vira-lata (SRD)': '🐈',
    'Maine Coon': '🦁',
    Angorá: '🐱',
    Ragdoll: '🐱',
  },
  other: {
    Calopsita: '🦜',
    'Coelho Netherland': '🐰',
    'Hamster Sírio': '🐹',
    'Porquinho da Índia': '🐹',
    Ferret: '🦦',
    Chinchila: '🐭',
  },
};
export const SPECIES_CONFIG: Record<
  Species,
  {
    emoji: string;
    label: string;
    description: string;
    color: string;
  }
> = {
  dog: { emoji: '🐕', label: 'Cão', description: 'Canino doméstico', color: '#289fce' },
  cat: { emoji: '🐈', label: 'Gato', description: 'Felino doméstico', color: '#126ca8' },
  other: { emoji: '🐾', label: 'Outro', description: 'Aves, roedores...', color: '#F96167' },
};
export function getBreedIcon(species: Species, breed: string): string {
  const safeSpecies: Species = BREED_ICONS[species] ? species : 'other';
  return BREED_ICONS[safeSpecies]?.[breed] ?? SPECIES_CONFIG[safeSpecies].emoji;
}
