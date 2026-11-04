import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { preferencesStorage } from '@storage/preferencesStorage';
import { COLORS } from '@constants/theme';
const DARK_COLORS = {
  primary: '#289fce',
  secondary: '#126ca8',
  accent: '#F96167',
  dark: '#E2E8F0',
  textSecondary: '#94A3B8',
  background: '#0F172A',
  white: '#1E293B',
  onPrimary: '#FFFFFF',
  scoreGreen: '#5792aa',
  scoreYellow: '#FFD93D',
  scoreRed: '#F96167',
  border: '#334155',
};
export type ThemeColors = typeof COLORS;
type Colors = ThemeColors;
interface ThemeContextType {
  isDark: boolean;
  colors: Colors;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: COLORS,
  toggleTheme: () => {},
});
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [savedPreference, setSavedPreference] = useState<boolean | null>(null);
  useEffect(() => {
    preferencesStorage.getDarkMode().then(setSavedPreference);
  }, []);
  const isDark = savedPreference ?? systemScheme === 'dark';
  const toggleTheme = () => {
    const next = !isDark;
    setSavedPreference(next);
    preferencesStorage.setDarkMode(next);
  };
  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? (DARK_COLORS as Colors) : COLORS, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
