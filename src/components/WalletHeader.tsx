import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { Pet } from '../models/Pet';
import { SPECIES_CONFIG } from '../constants/races';
interface WalletHeaderProps {
  pets: Pet[];
  currentPet: Pet | null;
  onBack: () => void;
  onSelectPet: (pet: Pet) => void;
  onGeneratePDF?: () => void;
  generatingPDF?: boolean;
}
export const WalletHeader: React.FC<WalletHeaderProps> = ({
  pets,
  currentPet,
  onBack,
  onSelectPet,
  onGeneratePDF,
  generatingPDF,
}) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carteirinha Digital</Text>
        {onGeneratePDF && (
          <TouchableOpacity style={styles.pdfBtnHeader} onPress={onGeneratePDF} disabled={generatingPDF}>
            {generatingPDF ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.pdfBtnHeaderText}>📄 PDF</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {pets.length > 1 && (
        <View style={styles.selectorWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petSelectorContainer}
          >
            {pets.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.petChip, currentPet?.id === p.id && styles.petChipActive]}
                onPress={() => onSelectPet(p)}
              >
                <Text style={styles.petChipText}>
                  {SPECIES_CONFIG[p.species]?.emoji ?? '🐾'} {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    header: {
      backgroundColor: COLORS.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl,
      paddingTop: 60,
      paddingBottom: SPACING.md,
      gap: SPACING.md,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
    headerTitle: { flex: 1, fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
    pdfBtnHeader: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    pdfBtnHeaderText: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '700' },
    selectorWrapper: { backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    petSelectorContainer: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, gap: SPACING.sm },
    petChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: COLORS.background,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    petChipActive: { backgroundColor: `${COLORS.primary}15`, borderColor: COLORS.primary },
    petChipText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.dark },
  });