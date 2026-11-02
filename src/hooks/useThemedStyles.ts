import { useMemo } from 'react';
import { ThemeColors, useTheme } from '@contexts/ThemeContext';

export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): { styles: T; colors: ThemeColors } {
  const { colors } = useTheme();
  const styles = useMemo(() => factory(colors), [colors, factory]);
  return { styles, colors };
}
