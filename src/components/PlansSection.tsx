import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { PlanDetailsModal } from './PlanDetailsModal';
import { BillingCycle, Plan, PLANS, PricedPlan, priceFor } from '@constants/plans';
import { useThemedStyles } from '@hooks/useThemedStyles';
export const PlansSection: React.FC = () => {
  const { styles } = useThemedStyles(makeStyles);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PricedPlan | null>(null);
  const handleOpenDetails = (plan: Plan) => setSelectedPlan(priceFor(plan, billingCycle));
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Planos Disponíveis</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, billingCycle === 'monthly' && styles.toggleButtonActive]}
            onPress={() => setBillingCycle('monthly')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, billingCycle === 'monthly' && styles.toggleTextActive]}>Mensal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, billingCycle === 'annual' && styles.toggleButtonActive]}
            onPress={() => setBillingCycle('annual')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, billingCycle === 'annual' && styles.toggleTextActive]}>Anual</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {PLANS.map((plan) => {
          const currentPrice = priceFor(plan, billingCycle).price;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, { borderColor: plan.color + '35' }]}
              onPress={() => handleOpenDetails(plan)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: plan.color }]}>
                  <Text style={styles.badgeText}>{plan.name}</Text>
                </View>
                <Text style={styles.cardPrice}>{currentPrice}</Text>
              </View>

              <Text style={styles.cardDescription}>{plan.description}</Text>

              <View style={styles.cardFooter}>
                <Text style={[styles.linkLabel, { color: plan.color }]}>Ver todos os benefícios</Text>
                <Ionicons name="arrow-forward" size={16} color={plan.color} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <PlanDetailsModal visible={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan} />
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: {
      marginTop: SPACING.xl,
      marginBottom: SPACING.xl,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
      paddingHorizontal: SPACING.xl,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
      color: COLORS.dark,
      letterSpacing: 0.3,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: COLORS.background,
      padding: 3,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    toggleButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 9,
    },
    toggleButtonActive: {
      backgroundColor: COLORS.white,
      elevation: 2,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    toggleText: {
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.textSecondary,
    },
    toggleTextActive: {
      color: COLORS.primary,
      fontWeight: '700',
    },
    scrollContent: {
      paddingHorizontal: SPACING.xl,
      gap: SPACING.md,
      paddingBottom: SPACING.md,
    },
    planCard: {
      width: 280,
      backgroundColor: COLORS.white,
      borderRadius: 24,
      padding: SPACING.lg,
      borderWidth: 1,
      justifyContent: 'space-between',
      minHeight: 160,
      elevation: 4,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 12,
    },
    badgeText: {
      color: COLORS.onPrimary,
      fontSize: 12,
      fontWeight: '700',
    },
    cardPrice: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '800',
      color: COLORS.dark,
    },
    cardDescription: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 18,
      marginBottom: SPACING.md,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderTopWidth: 1,
      borderTopColor: COLORS.background,
      paddingTop: SPACING.sm,
    },
    linkLabel: {
      fontSize: 13,
      fontWeight: '700',
    },
  });
