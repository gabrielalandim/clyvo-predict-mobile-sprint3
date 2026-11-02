export type ScoreBand = 'excelente' | 'regular' | 'critico';

export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return 'excelente';
  if (score >= 50) return 'regular';
  return 'critico';
}

const BAND_LABELS: Record<ScoreBand, string> = {
  excelente: 'Excelente',
  regular: 'Regular',
  critico: 'Crítico',
};

export function getScoreStatus(score: number): string {
  return BAND_LABELS[getScoreBand(score)];
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}
