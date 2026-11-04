export const petKeys = {
  all: ['pets'] as const,
  detail: (id: string) => ['pets', id] as const,
};
