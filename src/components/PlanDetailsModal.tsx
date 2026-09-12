import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
interface Plan {
  id: 'basic' | 'plus' | 'premium';
  name: string;
  price: string;
  description: string;
  color: string;
  features: string[];
}
interface PlanDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  plan: Plan | null;
}
export const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({ visible, onClose, plan }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  if (!plan) return null;
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { backgroundColor: plan.color }]}>
            <Text style={styles.modalTitle}>Plano {plan.name}</Text>
            <Text style={styles.modalPrice}>{plan.price}</Text>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalDescription}>{plan.description}</Text>
            <Text style={styles.featuresSectionTitle}>Benefícios Inclusos:</Text>

            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={plan.color} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: plan.color }]} onPress={onClose}>
              <Text style={styles.actionButtonText}>Contratar Plano</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl,
    },
    modalContainer: {
      width: '100%',
      backgroundColor: COLORS.white,
      borderRadius: 28,
      overflow: 'hidden',
      elevation: 20,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 15,
    },
    modalHeader: {
      padding: SPACING.xl,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: COLORS.white,
      marginBottom: 4,
    },
    modalPrice: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
      color: COLORS.white,
      opacity: 0.95,
    },
    modalScroll: {
      padding: SPACING.xl,
      maxHeight: 300,
    },
    modalDescription: {
      fontSize: FONT_SIZES.md,
      color: COLORS.dark,
      lineHeight: 22,
      marginBottom: SPACING.lg,
      fontWeight: '500',
    },
    featuresSectionTitle: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '700',
      color: COLORS.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: SPACING.md,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    featureText: {
      fontSize: FONT_SIZES.md,
      color: COLORS.dark,
      flex: 1,
      fontWeight: '500',
    },
    modalFooter: {
      padding: SPACING.xl,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      gap: SPACING.sm,
    },
    actionButton: {
      width: '100%',
      padding: SPACING.md,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      color: COLORS.white,
      fontSize: FONT_SIZES.md,
      fontWeight: '700',
    },
    closeModalButton: {
      width: '100%',
      padding: SPACING.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeModalButtonText: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
    },
  });
