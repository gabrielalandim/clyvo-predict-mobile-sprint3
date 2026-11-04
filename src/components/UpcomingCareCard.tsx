import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { ThemeColors } from '@contexts/ThemeContext';
import { CareReminder, getCareReminderType } from '@models/CareReminder';
import { formatReminderDate } from '@utils/date';
import { useThemedStyles } from '@hooks/useThemedStyles';

interface UpcomingCareCardProps {
  reminders: CareReminder[];
  onSchedule: () => void;
  onCancel: (reminder: CareReminder) => void;
}

export const UpcomingCareCard: React.FC<UpcomingCareCardProps> = ({ reminders, onSchedule, onCancel }) => {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>PRÓXIMOS CUIDADOS</Text>
        <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
      </View>

      {reminders.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum lembrete agendado. Agende a próxima consulta, vacina ou exame.</Text>
      ) : (
        reminders.map((reminder) => {
          const config = getCareReminderType(reminder.type);
          return (
            <View key={reminder.id} style={styles.reminderRow}>
              <Text style={styles.emoji}>{config.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderTitle}>{config.label}</Text>
                <Text style={styles.reminderDate}>{formatReminderDate(new Date(reminder.scheduledFor))}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onCancel(reminder)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Cancelar lembrete"
              >
                <Ionicons name="close-circle-outline" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          );
        })
      )}

      <TouchableOpacity style={styles.scheduleButton} onPress={onSchedule}>
        <Ionicons name="alarm-outline" size={18} color={COLORS.primary} />
        <Text style={styles.scheduleText}>Agendar lembrete</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginTop: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.dark, letterSpacing: 0.5 },
    emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.sm },
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      marginTop: SPACING.md,
      paddingBottom: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    emoji: { fontSize: 22 },
    reminderTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.dark },
    reminderDate: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    scheduleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
      marginTop: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    scheduleText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZES.md },
  });
