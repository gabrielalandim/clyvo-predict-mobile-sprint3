export const COLORS = {
  primary: '#289fce',
  secondary: '#126ca8',
  accent: '#F96167',
  dark: '#1E2761',
  textSecondary: '#7F8C8D',
  background: '#F8F9FA',
  white: '#FFFFFF',
  scoreGreen: '#5792aa',
  scoreYellow: '#FFD93D',
  scoreRed: '#F96167',
  border: '#E0E0E0',
};
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
export const FONT_SIZES = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  huge: 32,
};
export const getScoreColor = (score: number): string => {
  if (score >= 80) return COLORS.scoreGreen;
  if (score >= 50) return COLORS.scoreYellow;
  return COLORS.scoreRed;
};
