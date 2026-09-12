import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
interface ScoreInfoModalProps {
  visible: boolean;
  onClose: () => void;
}
export const ScoreInfoModal: React.FC<ScoreInfoModalProps> = ({ visible, onClose }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Como calculamos o Score?</Text>
          <Text style={styles.modalDescription}>
            Nossa inteligência analisa o histórico preventivo e a constância de cuidados do seu pet:
          </Text>

          <View style={styles.modalFactorItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} style={styles.modalFactorIcon} />
            <View style={styles.modalFactorTextContainer}>
              <Text style={styles.modalFactorTitle}>Histórico Médico</Text>
              <Text style={styles.modalFactorSub}>
                Pontua o registro correto de vacinas, vermífugos e tratamentos essenciais.
              </Text>
            </View>
          </View>

          <View style={styles.modalFactorItem}>
            <Ionicons name="pulse-outline" size={20} color={COLORS.primary} style={styles.modalFactorIcon} />
            <View style={styles.modalFactorTextContainer}>
              <Text style={styles.modalFactorTitle}>Frequência de Check-ups</Text>
              <Text style={styles.modalFactorSub}>
                Avalia a regularidade de consultas de rotina baseadas na idade e espécie do pet.
              </Text>
            </View>
          </View>

          <View style={styles.modalFactorItem}>
            <Ionicons name="fitness-outline" size={20} color={COLORS.primary} style={styles.modalFactorIcon} />
            <View style={styles.modalFactorTextContainer}>
              <Text style={styles.modalFactorTitle}>Predisposição Racial</Text>
              <Text style={styles.modalFactorSub}>
                Eventos críticos (como emergências) pesam de acordo com a genética da raça.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl,
    },
    modalContent: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      padding: SPACING.xl,
      width: '100%',
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    modalTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
    },
    modalDescription: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      marginBottom: SPACING.lg,
      lineHeight: 18,
    },
    modalFactorItem: {
      flexDirection: 'row',
      marginBottom: SPACING.md,
      alignItems: 'flex-start',
    },
    modalFactorIcon: {
      marginRight: SPACING.sm,
      marginTop: 2,
    },
    modalFactorTextContainer: {
      flex: 1,
    },
    modalFactorTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '700',
      color: COLORS.dark,
    },
    modalFactorSub: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 2,
      lineHeight: 16,
    },
    modalCloseButton: {
      backgroundColor: COLORS.primary,
      borderRadius: 14,
      padding: SPACING.md,
      alignItems: 'center',
      marginTop: SPACING.md,
    },
    modalCloseButtonText: {
      color: COLORS.white,
      fontWeight: '700',
      fontSize: FONT_SIZES.md,
    },
  });
