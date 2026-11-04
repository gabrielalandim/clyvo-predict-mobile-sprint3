import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@components/AppText';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { TEAM_MEMBERS } from '@constants/team';
import { ThemeColors } from '@contexts/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { getAppInfo } from '@utils/appInfo';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'About'>;
};

const appInfo = getAppInfo();

export default function AboutScreen({ navigation }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: 'Versão', value: appInfo.version },
    { label: 'Commit de referência', value: appInfo.shortCommitHash, mono: true },
    { label: 'Data do build', value: appInfo.buildDate ? new Date(appInfo.buildDate).toLocaleString('pt-BR') : '—' },
    { label: 'API', value: appInfo.apiBaseUrl, mono: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Sobre o App</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <View style={styles.logoCircle}>
            <Ionicons name="paw" size={34} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>{appInfo.name}</Text>
          <Text style={styles.tagline}>Do Reativo ao Preventivo</Text>
        </View>

        <View style={styles.card}>
          {rows.map((row, index) => (
            <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowDivider]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={[styles.rowValue, row.mono && styles.mono]} selectable numberOfLines={2}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hash completo do commit</Text>
          <Text style={[styles.fullHash, styles.mono]} selectable>
            {appInfo.commitHash}
          </Text>
          {appInfo.hasLocalChanges && (
            <Text style={styles.warning}>Build gerado com alterações locais não commitadas.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Equipe — FIAP Challenge 2026 × Clyvo</Text>
          {TEAM_MEMBERS.map((member) => (
            <View key={member.rm} style={styles.memberRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRm}>RM {member.rm}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>2TDS · Mobile Application Development · Sprint 4</Text>
      </ScrollView>
    </View>
  );
}

const makeStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
      backgroundColor: COLORS.secondary,
      paddingTop: 55,
      paddingBottom: SPACING.lg,
      paddingHorizontal: SPACING.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: { width: 32, height: 32, justifyContent: 'center' },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.onPrimary },
    content: { padding: SPACING.xl, paddingBottom: 40 },
    brand: { alignItems: 'center', marginBottom: SPACING.xl },
    logoCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: `${COLORS.primary}18`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    appName: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: COLORS.dark, marginTop: SPACING.md },
    tagline: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 2 },
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    cardTitle: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.sm },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.md },
    rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
    rowLabel: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
    rowValue: { flexShrink: 1, fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.dark, textAlign: 'right' },
    mono: { fontFamily: 'monospace' },
    fullHash: { fontSize: FONT_SIZES.sm, color: COLORS.dark },
    warning: { marginTop: SPACING.sm, fontSize: FONT_SIZES.sm, color: COLORS.accent, fontWeight: '600' },
    memberRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs },
    memberName: { fontSize: FONT_SIZES.md, color: COLORS.dark, flexShrink: 1 },
    memberRm: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
    footer: { textAlign: 'center', fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.md },
  });
