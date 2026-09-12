import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONT_SIZES, getScoreColor } from '../constants/theme';
import { SPECIES_CONFIG } from '../constants/races';
import { getEventTypeConfig } from '@models/HealthEvent';
import { Pet } from '@models/Pet';
import { HealthEvent } from '@models/HealthEvent';
import { petService } from '@services/petService';
import { healthEventService } from '@services/healthEventService';
import { BottomTabBar } from '../components/BottomBarTab';
import { useTheme } from '@contexts/ThemeContext';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'History'>;
};
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
type Period = '1m' | '3m' | '6m';
const PERIOD_MONTHS: Record<Period, number> = { '1m': 1, '3m': 3, '6m': 6 };
const CHART_MONTHS_BACK = 6;
const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excelente';
  if (score >= 50) return 'Regular';
  return 'Crítico';
};
const parseEventDate = (dataEvento: string): Date => new Date(`${dataEvento}T00:00:00`);
export default function HistoryScreen({ navigation }: Props) {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petSel, setPetSel] = useState<string>('');
  const [period, setPeriod] = useState<Period>('6m');
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (petSel) {
      loadEvents(petSel);
    }
  }, [petSel]);
  const loadData = async () => {
    try {
      const remotePets = await petService.listPets();
      setPets(remotePets);
      if (remotePets.length > 0) {
        setPetSel(remotePets[0].id);
      }
    } catch (error: any) {
      Alert.alert('Erro ao carregar pets', error.message);
    } finally {
      setLoading(false);
    }
  };
  const loadEvents = async (id: string) => {
    try {
      const remoteEvents = await healthEventService.listByPet(id);
      setEvents(remoteEvents);
    } catch (error: any) {
      setEvents([]);
      Alert.alert('Erro ao carregar histórico', error.message);
    }
  };
  const currentPet = pets.find((p) => p.id === petSel);
  const currentScore = currentPet?.score ?? 70;
  const filteredEvents = useMemo(() => {
    const monthsBack = PERIOD_MONTHS[period];
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - monthsBack);
    return events.filter((e) => parseEventDate(e.dataEvento) >= cutoff);
  }, [events, period]);
  const periodDelta = filteredEvents.reduce((acc, curr) => acc + curr.deltaScore, 0);
  const chartData = useMemo(() => {
    const points: number[] = [];
    const now = new Date();
    for (let i = CHART_MONTHS_BACK; i >= 0; i--) {
      const boundary = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const futureDeltaSum = events
        .filter((e) => parseEventDate(e.dataEvento) >= boundary)
        .reduce((acc, e) => acc + e.deltaScore, 0);
      const score = Math.max(0, Math.min(100, currentScore - futureDeltaSum));
      points.push(score);
    }
    return points;
  }, [events, currentScore]);
  const maxChart = Math.max(...chartData);
  const minChart = Math.max(0, Math.min(...chartData) - 5);
  const currentMonthIdx = new Date().getMonth();
  const displayMonths = Array.from({ length: CHART_MONTHS_BACK + 1 }, (_, i) => {
    const idx = (currentMonthIdx - CHART_MONTHS_BACK + i + 12) % 12;
    return MONTHS[idx];
  });
  const PERIODS: {
    k: Period;
    label: string;
  }[] = [
    { k: '1m', label: '1 mês' },
    { k: '3m', label: '3 meses' },
    { k: '6m', label: '6 meses' },
  ];
  const calculateAgeText = (birthDateStr: string): string => {
    if (!birthDateStr || birthDateStr.length < 10) return '--';
    const parts = birthDateStr.split('/');
    if (parts.length !== 3) return '--';
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const birthDate = new Date(year, month, day);
    const today = new Date();
    if (isNaN(birthDate.getTime()) || birthDate > today) return '--';
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    if (years > 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  };
  const breakdownItems = useMemo(() => {
    const countByType = (type: HealthEvent['tipoEvento']) => filteredEvents.filter((e) => e.tipoEvento === type).length;
    const items = [
      { label: 'Vacinas', icon: '💉', count: countByType('VACINA') },
      { label: 'Exames', icon: '🔬', count: countByType('EXAME') },
      { label: 'Consultas', icon: '🩺', count: countByType('CONSULTA_ROTINA') },
      {
        label: 'Ocorrências',
        icon: '⚠️',
        count: countByType('DOENCA_LEVE') + countByType('DOENCA_GRAVE') + countByType('ACIDENTE'),
      },
    ];
    const total = filteredEvents.length;
    return items.map((item) => ({
      ...item,
      pct: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));
  }, [filteredEvents]);
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
                          ? calculateAgeText(currentPet.birthDate)
                          : `${currentPet.age} ${currentPet.age === 1 ? 'ano' : 'anos'}`}
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
                      {getScoreLabel(currentScore)}
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
              {PERIODS.map((p) => (
                <TouchableOpacity
                  key={p.k}
                  style={[styles.periodBtn, period === p.k && styles.periodBtnActive]}
                  onPress={() => setPeriod(p.k)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.periodText, period === p.k && styles.periodTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Evolução do Score (últimos 6 meses)</Text>
              <View style={styles.chart}>
                {chartData.map((val, i) => {
                  const height = maxChart === minChart ? 100 : ((val - minChart) / (maxChart - minChart)) * 100;
                  const color = getScoreColor(val);
                  return (
                    <View key={i} style={styles.chartBar}>
                      <Text style={[styles.chartValue, { color }]}>{val}</Text>
                      <View style={[styles.barFill, { height: `${height}%` as any, backgroundColor: color }]} />
                      <Text style={styles.chartMonth}>{displayMonths[i]}</Text>
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
                    <Text style={styles.eventDate}>{parseEventDate(evt.dataEvento).toLocaleDateString('pt-BR')}</Text>
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

        <BottomTabBar activeRoute="History" navigation={navigation} petId={petSel} />
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
    backArrow: { fontSize: FONT_SIZES.xxl, fontWeight: '600', color: COLORS.white },
    headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white, letterSpacing: 0.3 },
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
    profileName: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.white, marginBottom: SPACING.sm },
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
    metaBadgeValue: { fontSize: 12, color: COLORS.white, fontWeight: '700' },
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
