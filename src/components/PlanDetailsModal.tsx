import React from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { PricedPlan } from '@constants/plans';
interface PlanDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  plan: PricedPlan | null;
}
export const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({ visible, onClose, plan }) => {
  const { styles } = useThemedStyles(makeStyles);
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
            <Text style={styles.footerNote}>Planos pagos em fase de lançamento pela Clyvo.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: plan.color }]} onPress={onClose}>
              <Text style={styles.actionButtonText}>Entendi</Text>
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
      color: COLORS.onPrimary,
      marginBottom: 4,
    },
    modalPrice: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
      color: COLORS.onPrimary,
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
      color: COLORS.onPrimary,
      fontSize: FONT_SIZES.md,
      fontWeight: '700',
    },
    footerNote: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      textAlign: 'center',
      marginBottom: SPACING.sm,
    },
  });
