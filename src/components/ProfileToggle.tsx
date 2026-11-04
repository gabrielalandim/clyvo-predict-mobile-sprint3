import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/AppText';
import { Perfil } from '@models/Auth';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { ThemeColors } from '@contexts/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';

const OPTIONS: { value: Perfil; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'TUTOR', label: 'Tutor', icon: 'paw' },
  { value: 'VETERINARIO', label: 'Veterinário', icon: 'medkit-outline' },
];

interface Props {
  value: Perfil;
  onChange: (perfil: Perfil) => void;
}

export function ProfileToggle({ value, onChange }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <Ionicons name={option.icon} size={16} color={active ? COLORS.onPrimary : COLORS.secondary} />
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const makeStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: 1.5,
      borderColor: COLORS.border,
      borderRadius: 24,
      padding: 4,
      marginBottom: SPACING.sm,
    },
    option: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
      paddingVertical: SPACING.sm,
      borderRadius: 20,
    },
    optionActive: { backgroundColor: COLORS.secondary },
    label: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.secondary },
    labelActive: { color: COLORS.onPrimary },
  });
