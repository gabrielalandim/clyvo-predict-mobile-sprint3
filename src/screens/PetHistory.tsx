import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@components/AppText';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES, getScoreColor } from '@constants/theme';
import { SPECIES_CONFIG } from '@constants/races';
import { getEventTypeConfig } from '@models/HealthEvent';
import { getScoreStatus } from '@utils/score';
import { formatAgeFromBirthDate, formatIsoDateBR, formatYears } from '@utils/date';
import { HISTORY_PERIODS } from '@utils/scoreHistory';
import { BottomTabBar } from '@components/BottomTabBar';
import { usePetScoreHistory } from '@hooks/usePetScoreHistory';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useErrorAlert } from '@hooks/useErrorAlert';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PetHistory'>;
  route: RouteProp<RootStackParamList, 'PetHistory'>;
};
export default function PetHistoryScreen({ navigation, route }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const {
    pets,
    isLoading: loading,
    petsError,
    eventsError,
    selectedPetId: petSel,
    setSelectedPetId: setPetSel,
    currentPet,
    currentScore,
    period,
    setPeriod,
    filteredEvents,
    periodDelta,
    chart,
    breakdown: breakdownItems,
  } = usePetScoreHistory(route.params?.petId);

  useErrorAlert(petsError, 'Erro ao carregar pets');
  useErrorAlert(eventsError, 'Erro ao carregar histórico');

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.topRow}>
              <TouchableOpacity
                style={styles.backButtonContainer}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Histórico de Saúde</Text>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
              <View style={styles.petSelector}>
                {pets.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.petChip, petSel === p.id && styles.petChipActive]}
                    onPress={() => setPetSel(p.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.petChipEmoji}>{SPECIES_CONFIG[p.species]?.emoji ?? '🐾'}</Text>
                    <Text style={[styles.petChipText, petSel === p.id && styles.petChipTextActive]}>{p.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {currentPet && (
              <View style={styles.profileContainer}>
                <View style={styles.avatarWrapper}>
                  <Text style={styles.avatarEmoji}>{SPECIES_CONFIG[currentPet.species]?.emoji ?? '🐾'}</Text>
                </View>

                <View style={styles.profileDetails}>
                  <Text style={styles.profileName}>{currentPet.name}</Text>

                  <View style={styles.metaBadgeRow}>
                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeLabel}>Raça</Text>
                      <Text style={styles.metaBadgeValue} numberOfLines={1}>
                        {currentPet.breed || 'SRD'}
                      </Text>
                    </View>

                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeLabel}>Idade</Text>
                      <Text style={styles.metaBadgeValue}>
                        {currentPet.birthDate
                          ? formatAgeFromBirthDate(currentPet.birthDate)
                          : formatYears(currentPet.age)}
                      </Text>
                    </View>

                    <View style={styles.metaBadge}>
                      <Text style={styles.metaBadgeLabel}>Peso</Text>
                      <Text style={styles.metaBadgeValue}>
                        {currentPet.weight ? `${currentPet.weight} kg` : '-- kg'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.body}>
            <View style={styles.scoreCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreLabelText}>Score atual</Text>
                <Text style={styles.scoreValueText}>{currentScore}</Text>
                <View style={{ flexDirection: 'row', marginTop: SPACING.xs }}>
                  <View
                    style={{
                      backgroundColor: `${getScoreColor(currentScore)}22`,
                      borderRadius: 20,
                      paddingHorizontal: SPACING.md,
                      paddingVertical: SPACING.xs,
                    }}
                  >
                    <Text style={{ fontSize: FONT_SIZES.sm, fontWeight: '700', color: getScoreColor(currentScore) }}>
                      {getScoreStatus(currentScore)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.scoreVariation}>
                  {periodDelta > 0 ? '+' : ''}
                  {periodDelta} pts no período selecionado
                </Text>
              </View>

              <View style={[styles.inlineRing, { borderColor: getScoreColor(currentScore) }]}>
                <Text style={[styles.inlineRingText, { color: getScoreColor(currentScore) }]}>{currentScore}</Text>
              </View>
            </View>

            <View style={styles.periodRow}>
              {HISTORY_PERIODS.map((p) => (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.periodBtn, period === p.key && styles.periodBtnActive]}
                  onPress={() => setPeriod(p.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Evolução do Score (últimos 6 meses)</Text>
              <View style={styles.chart}>
                {chart.points.map((val, i) => {
                  const height = chart.max === chart.min ? 100 : ((val - chart.min) / (chart.max - chart.min)) * 100;
                  const color = getScoreColor(val);
                  return (
                    <View key={i} style={styles.chartBar}>
                      <Text style={[styles.chartValue, { color }]}>{val}</Text>
                      <View style={[styles.barFill, { height: `${height}%` as any, backgroundColor: color }]} />
                      <Text style={styles.chartMonth}>{chart.months[i]}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Breakdown do Período</Text>
              {breakdownItems.map((f) => (
                <View key={f.label} style={styles.factorRow}>
                  <View style={styles.factorLabel}>
                    <Text style={styles.factorIcon}>{f.icon}</Text>
                    <Text style={styles.factorText}>{f.label}</Text>
                  </View>
                  <View style={styles.factorBar}>
                    <View
                      style={[styles.factorFill, { width: `${f.pct}%` as any, backgroundColor: getScoreColor(f.pct) }]}
                    />
                  </View>
                  <Text style={[styles.factorPct, { color: getScoreColor(f.pct) }]}>{f.count}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.cardTitle, { marginBottom: SPACING.md }]}>Últimas Alterações</Text>

            {filteredEvents.length === 0 ? (
              <View style={styles.emptyEventsCard}>
                <Text style={styles.emptyEventsText}>Nenhum evento de saúde no período selecionado.</Text>
              </View>
            ) : (
              filteredEvents.map((evt) => (
                <View key={evt.id} style={styles.eventCard}>
                  <View
                    style={[
                      styles.eventIcon,
                      { backgroundColor: evt.deltaScore < 0 ? `${COLORS.accent}15` : `${COLORS.primary}15` },
                    ]}
                  >
                    <Text style={{ fontSize: FONT_SIZES.xl }}>{getEventTypeConfig(evt.tipoEvento).emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle}>{evt.descricao}</Text>
                    <Text style={styles.eventDate}>{formatIsoDateBR(evt.dataEvento)}</Text>
                  </View>
                  <Text style={[styles.eventDelta, { color: evt.deltaScore < 0 ? COLORS.accent : COLORS.scoreGreen }]}>
                    {evt.deltaScore > 0 ? '+' : ''}
                    {evt.deltaScore}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <BottomTabBar activeRoute="PetHistory" navigation={navigation} petId={petSel} />
      </View>
    </SafeAreaView>
  );
}
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    header: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.xl,
      paddingTop: 50,
      paddingBottom: SPACING.xl * 1.4,
      borderBottomLeftRadius: 36,
      borderBottomRightRadius: 36,
      elevation: 6,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
    },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
    backButtonContainer: { paddingVertical: SPACING.xs },
    backArrow: { fontSize: FONT_SIZES.xxl, fontWeight: '600', color: COLORS.onPrimary },
    headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.onPrimary, letterSpacing: 0.3 },
    selectorScroll: { marginBottom: SPACING.lg },
    petSelector: { flexDirection: 'row', gap: SPACING.sm },
    petChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.25)',
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    petChipActive: { borderColor: COLORS.white, backgroundColor: COLORS.white, elevation: 3 },
    petChipEmoji: { fontSize: FONT_SIZES.md },
    petChipText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
    petChipTextActive: { color: COLORS.primary, fontWeight: '700' },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 24,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
      gap: SPACING.md,
    },
    avatarWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    avatarEmoji: { fontSize: 32 },
    profileDetails: { flex: 1 },
    profileName: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.onPrimary, marginBottom: SPACING.sm },
    metaBadgeRow: { flexDirection: 'row', gap: SPACING.sm },
    metaBadge: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 12,
      paddingVertical: 6,
      paddingHorizontal: 8,
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    metaBadgeLabel: {
      fontSize: 10,
      color: 'rgba(255, 255, 255, 0.6)',
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 1,
    },
    metaBadgeValue: { fontSize: 12, color: COLORS.onPrimary, fontWeight: '700' },
    body: { padding: SPACING.xl },
    scoreCard: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      elevation: 2,
      shadowColor: '#1E2761',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    scoreLabelText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
    scoreValueText: { fontSize: 40, fontWeight: '700', color: COLORS.dark },
    scoreVariation: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
    inlineRing: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.white,
    },
    inlineRingText: { fontSize: FONT_SIZES.xl, fontWeight: '800' },
    periodRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
    periodBtn: {
      flex: 1,
      paddingVertical: SPACING.sm,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.white,
    },
    periodBtnActive: { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}15` },
    periodText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.dark },
    periodTextActive: { color: COLORS.primary, fontWeight: '700' },
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      elevation: 2,
      shadowColor: '#1E2761',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    cardTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.md },
    chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: SPACING.sm, paddingTop: SPACING.md },
    chartBar: { flex: 1, alignItems: 'center', gap: SPACING.xs },
    chartValue: { fontSize: 9, fontWeight: '700' },
    barFill: { width: '100%', borderRadius: 4, minHeight: 4 },
    chartMonth: { fontSize: 9, color: COLORS.textSecondary, fontWeight: '500' },
    factorRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
    factorLabel: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, width: 90 },
    factorIcon: { fontSize: FONT_SIZES.md },
    factorText: { fontSize: FONT_SIZES.sm, color: COLORS.dark, fontWeight: '500' },
    factorBar: { flex: 1, height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden' },
    factorFill: { height: '100%', borderRadius: 4 },
    factorPct: { width: 36, fontSize: FONT_SIZES.sm, fontWeight: '700', textAlign: 'right' },
    emptyEventsCard: {
      backgroundColor: COLORS.white,
      padding: SPACING.lg,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    emptyEventsText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
    eventCard: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.border,
      elevation: 2,
      shadowColor: '#1E2761',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    eventIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    eventTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.dark },
    eventDate: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    eventDelta: { fontSize: FONT_SIZES.lg, fontWeight: '700', minWidth: 40, textAlign: 'right' },
  });
