import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, getScoreColor } from '../constants/theme';
import { Pet } from '@models/Pet';
import { getBreedIcon } from '../constants/races';
import { useTheme } from '@contexts/ThemeContext';
interface PetCardProps {
  item: Pet;
  onPressDetails: () => void;
  onPressRegisterEvent: () => void;
  onPressDelete: () => void;
}
export const PetCard: React.FC<PetCardProps> = ({ item, onPressDetails, onPressRegisterEvent, onPressDelete }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const { name, breed, score, species } = item;
  const petEmoji = getBreedIcon(species, breed);
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.mainPressable} onPress={onPressDetails} activeOpacity={0.8}>
        <View style={styles.avatarWrapper}>
          {item.photoUri ? (
            <Image source={{ uri: item.photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: `${getScoreColor(score)}12` }]}>
              <Text style={styles.avatarEmoji}>{petEmoji}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoWrapper}>
          <Text style={styles.petName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.petBreed} numberOfLines={1}>
            {breed}
          </Text>

          <View style={styles.detailsRow}>
            {item.birthDate && <Text style={styles.detailsText}>{item.birthDate}</Text>}
            {item.birthDate && item.weight !== undefined && <Text style={styles.dotDivider}>•</Text>}
            {item.weight !== undefined && <Text style={styles.detailsText}>{item.weight} kg</Text>}
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <View style={[styles.scoreRing, { borderColor: getScoreColor(score) }]}>
            <Text style={[styles.scoreNumber, { color: getScoreColor(score) }]}>{score}</Text>
          </View>
          <Text style={styles.scoreLabel}>Saúde</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionFooter} onPress={onPressRegisterEvent} activeOpacity={0.7}>
        <Ionicons name="add" size={16} color={COLORS.primary} />
        <Text style={styles.actionText}>Registrar Evento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={onPressDelete} activeOpacity={0.5}>
        <Ionicons name="close" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      marginBottom: SPACING.md,
      marginHorizontal: SPACING.xl,
      borderWidth: 1,
      borderColor: COLORS.border,
      elevation: 4,
      shadowColor: '#1E2761',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      overflow: 'hidden',
      position: 'relative',
    },
    deleteButton: {
      position: 'absolute',
      top: 14,
      right: 14,
      zIndex: 99,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: `${COLORS.border}40`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainPressable: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.lg,
      paddingRight: 50,
    },
    avatarWrapper: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    avatarImage: {
      width: 68,
      height: 68,
      borderRadius: 34,
      resizeMode: 'cover',
    },
    avatarPlaceholder: {
      width: 68,
      height: 68,
      borderRadius: 34,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarEmoji: {
      fontSize: 30,
    },
    infoWrapper: {
      flex: 1,
      marginLeft: SPACING.md,
      marginRight: SPACING.sm,
    },
    petName: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.dark,
      marginBottom: 2,
    },
    petBreed: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      fontWeight: '500',
      marginBottom: 6,
    },
    detailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailsText: {
      fontSize: 12,
      color: COLORS.textSecondary,
      fontWeight: '600',
    },
    dotDivider: {
      fontSize: 12,
      color: COLORS.border,
      marginHorizontal: 6,
    },
    scoreContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: SPACING.xs,
      marginTop: 8,
    },
    scoreRing: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.white,
    },
    scoreNumber: {
      fontSize: 16,
      fontWeight: '800',
    },
    scoreLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: COLORS.textSecondary,
      textTransform: 'uppercase',
      marginTop: 4,
      letterSpacing: 0.3,
    },
    actionFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${COLORS.primary}06`,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: `${COLORS.border}40`,
      gap: 4,
    },
    actionText: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.primary,
    },
  });
