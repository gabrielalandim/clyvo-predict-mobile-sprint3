import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { PlanDetailsModal } from './PlanDetailsModal';
import { useTheme } from '@contexts/ThemeContext';
interface Plan {
  id: 'basic' | 'plus' | 'premium';
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  color: string;
  features: string[];
}
const PLANS_DATA: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 'Gratuito',
    annualPrice: 'Gratuito',
    description: 'Essencial para começar a cuidar do seu melhor amigo com segurança.',
    color: '#7F8C8D',
    features: [
      'Monitoramento de até 1 Pet',
      'Histórico de saúde básico',
      'Breakdown simplificado do Score',
      'Lembretes de consultas padrão',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    monthlyPrice: 'R$ 9,90/mês',
    annualPrice: 'R$ 89,90/ano',
    description: 'Mais controle, relatórios detalhados e alertas inteligentes para seu pet.',
    color: '#289fce',
    features: [
      'Monitoramento de até 3 Pets',
      'Histórico completo sem restrições',
      'Breakdown detalhado do Score',
      'Alertas automatizados via WhatsApp',
      'Gráficos de evolução de 6 meses',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 'R$ 19,90/mês',
    annualPrice: 'R$ 179,90/ano',
    description: 'Experiência completa com suporte prioritário e predições avançadas com IA.',
    color: '#126ca8',
    features: [
      'Pets Ilimitados',
      'Análise preditiva de saúde CLYVO Predict',
      'Suporte prioritário 24/7 com especialistas',
      'Exportação de relatórios em PDF para veterinários',
      'Alertas instantâneos e customizados',
    ],
  },
];
export const PlansSection: React.FC = () => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const handleOpenDetails = (plan: Plan) => {
    const formattedPlan = {
      ...plan,
      price: billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice,
    };
    setSelectedPlan(formattedPlan);
    setModalVisible(true);
  };
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
        {PLANS_DATA.map((plan) => {
          const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
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

      <PlanDetailsModal visible={modalVisible} onClose={() => setModalVisible(false)} plan={selectedPlan} />
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
      color: COLORS.white,
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
