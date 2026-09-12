import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { COLORS, SPACING, FONT_SIZES, getScoreColor } from '../constants/theme';
import { Pet } from '../models/Pet';
import { SPECIES_CONFIG } from '../constants/races';
export const PetIdentityCard: React.FC<{
  pet: Pet;
}> = ({ pet }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const scoreColor = getScoreColor(pet.score);
  return (
    <View style={styles.identityCard}>
      <View style={[styles.avatar, { backgroundColor: `${COLORS.primary}20` }]}>
        <Text style={{ fontSize: 38 }}>{SPECIES_CONFIG[pet.species]?.emoji ?? '🐾'}</Text>
      </View>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petInfo}>
        {pet.breed} · {pet.weight ?? 0} kg · {pet.sex === 'male' ? 'Macho' : 'Fêmea'}
      </Text>
      <Text style={styles.petTutor}>Status: {pet.neutered ? 'Castrado' : 'Não castrado'}</Text>

      <View style={styles.badgeRow}>
        <View
          style={{ backgroundColor: `${scoreColor}22`, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}
        >
          <Text style={{ fontSize: FONT_SIZES.sm, fontWeight: '700', color: scoreColor }}>
            Score {pet.score} · {pet.score >= 80 ? 'Excelente' : pet.score >= 50 ? 'Regular' : 'Crítico'}
          </Text>
        </View>
      </View>
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    identityCard: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
    },
    petName: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
    petInfo: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, textAlign: 'center' },
    petTutor: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
    badgeRow: { flexDirection: 'row', marginTop: SPACING.md },
  });
