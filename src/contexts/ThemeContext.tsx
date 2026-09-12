import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@constants/theme';
const DARK_COLORS = {
  primary: '#289fce',
  secondary: '#126ca8',
  accent: '#F96167',
  dark: '#E2E8F0',
  textSecondary: '#94A3B8',
  background: '#0F172A',
  white: '#1E293B',
  scoreGreen: '#5792aa',
  scoreYellow: '#FFD93D',
  scoreRed: '#F96167',
  border: '#334155',
};
type Colors = typeof COLORS;
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
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('@clyvo:dark_mode');
        if (saved === 'true') setIsDark(true);
      } catch {}
    };
    load();
  }, []);
  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem('@clyvo:dark_mode', String(next));
    } catch {}
  };
  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? (DARK_COLORS as Colors) : COLORS, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
