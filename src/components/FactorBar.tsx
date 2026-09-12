import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_SIZES } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
interface FactorBarProps {
  label: string;
  percentage: number;
  color: string;
}
export const FactorBar: React.FC<FactorBarProps> = ({ label, percentage, color }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <View style={styles.factorContainer}>
      <View style={styles.rowBetween}>
        <Text style={styles.factorLabel}>{label}</Text>
        <Text style={styles.factorPercentage}>{percentage}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    factorContainer: {
      marginBottom: 12,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    factorLabel: {
      fontSize: FONT_SIZES.md,
      color: COLORS.dark,
      fontWeight: '500',
    },
    factorPercentage: {
      fontSize: FONT_SIZES.md,
      fontWeight: '700',
      color: COLORS.primary,
    },
    barBackground: {
      height: 8,
      backgroundColor: COLORS.background,
      borderRadius: 4,
      marginTop: 6,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: 4,
    },
  });
