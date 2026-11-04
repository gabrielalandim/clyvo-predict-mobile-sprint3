import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Text } from '@components/AppText';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { CARE_REMINDER_TYPES } from '@models/CareReminder';
import { ThemeColors } from '@contexts/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useReminderForm } from '@hooks/useReminderForm';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ScheduleReminder'>;
  route: RouteProp<RootStackParamList, 'ScheduleReminder'>;
};

export default function ScheduleReminderScreen({ navigation, route }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const { petId, petName } = route.params;
  const form = useReminderForm(petId, petName);

  const handleSchedule = async () => {
    const result = await form.submit();
    if (!result.ok) {
      Alert.alert(result.title, result.message);
      return;
    }
    Alert.alert('Lembrete agendado', result.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Agendar lembrete</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>Que cuidado do {petName} você quer lembrar?</Text>

        <View style={styles.typeRow}>
          {CARE_REMINDER_TYPES.map((option) => {
            const selected = form.type === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.typeCard, selected && styles.typeCardSelected]}
                onPress={() => form.setType(option.value)}
              >
                <Text style={styles.typeEmoji}>{option.emoji}</Text>
                <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1.4 }}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aaaa"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="numeric"
              maxLength={10}
              value={form.dateText}
              onChangeText={form.setDateText}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder="hh:mm"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="numeric"
              maxLength={5}
              value={form.timeText}
              onChangeText={form.setTimeText}
            />
          </View>
        </View>

        {form.preview && (
          <View style={styles.previewBox}>
            <Ionicons name="alarm-outline" size={18} color={COLORS.secondary} />
            <Text style={styles.previewText}>Você será avisado: {form.preview}</Text>
          </View>
        )}

        <Text style={styles.hint}>
          O lembrete chega como notificação no horário escolhido, mesmo com o app fechado. Ao tocar nele, o app abre o
          registro do cuidado já preenchido.
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSchedule} disabled={form.saving}>
          {form.saving ? (
            <ActivityIndicator color={COLORS.onPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Agendar lembrete</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const makeStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
      backgroundColor: COLORS.primary,
      paddingTop: 55,
      paddingBottom: SPACING.lg,
      paddingHorizontal: SPACING.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: { width: 32, height: 32, justifyContent: 'center' },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.onPrimary },
    form: { padding: SPACING.xl, paddingBottom: 40 },
    subtitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.lg },
    typeRow: { flexDirection: 'row', gap: SPACING.sm },
    typeCard: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: SPACING.lg,
      borderRadius: 16,
      backgroundColor: COLORS.white,
      borderWidth: 1.5,
      borderColor: COLORS.border,
    },
    typeCardSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.secondary },
    typeEmoji: { fontSize: 24 },
    typeLabel: { marginTop: SPACING.xs, fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.dark, textAlign: 'center' },
    typeLabelSelected: { color: '#FFFFFF' },
    row: { flexDirection: 'row', gap: SPACING.md },
    label: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
      marginTop: SPACING.xl,
    },
    input: {
      backgroundColor: COLORS.white,
      padding: SPACING.md,
      borderRadius: 14,
      fontSize: FONT_SIZES.md,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      color: COLORS.dark,
    },
    previewBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginTop: SPACING.lg,
      padding: SPACING.md,
      borderRadius: 12,
      backgroundColor: `${COLORS.primary}18`,
    },
    previewText: { flex: 1, color: COLORS.secondary, fontWeight: '600', fontSize: FONT_SIZES.md },
    hint: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.lg, lineHeight: 18 },
    primaryButton: {
      backgroundColor: COLORS.secondary,
      padding: SPACING.lg,
      borderRadius: 24,
      alignItems: 'center',
      marginTop: SPACING.xxl,
    },
    primaryButtonText: { color: '#FFFFFF', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  });
