import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@navigation/types';
import { openScreenForNotification } from '@navigation/notificationRoutes';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { ThemeColors } from '@contexts/ThemeContext';
import { InboxNotification } from '@models/AppNotification';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useNotificationInbox } from '@hooks/useNotificationInbox';
import { formatRelativeTime } from '@utils/date';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Notifications'>;
};

export default function NotificationsScreen({ navigation }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const { notifications, markAllRead, clear } = useNotificationInbox();

  useFocusEffect(useCallback(() => () => markAllRead(), [markAllRead]));

  const handleClear = () => {
    Alert.alert('Limpar notificações', 'Remover todo o histórico de notificações deste aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clear },
    ]);
  };

  const renderItem = ({ item }: { item: InboxNotification }) => {
    const isReminder = item.data.kind === 'care-reminder';
    return (
      <TouchableOpacity
        style={[styles.item, !item.read && styles.itemUnread]}
        activeOpacity={0.8}
        onPress={() => openScreenForNotification(item.data)}
      >
        <View style={[styles.iconCircle, { backgroundColor: isReminder ? `${COLORS.secondary}18` : `${COLORS.accent}18` }]}>
          <Ionicons
            name={isReminder ? 'alarm-outline' : 'pulse-outline'}
            size={20}
            color={isReminder ? COLORS.secondary : COLORS.accent}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemBody}>{item.body}</Text>
          <Text style={styles.itemTime}>{formatRelativeTime(new Date(item.receivedAt))}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleClear} disabled={notifications.length === 0}>
          <Ionicons name="trash-outline" size={22} color={notifications.length ? COLORS.white : 'transparent'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>Nenhuma notificação ainda</Text>
            <Text style={styles.emptyText}>
              Você será avisado aqui quando o score de um pet mudar de faixa e quando chegar a hora de um cuidado agendado.
            </Text>
          </View>
        }
      />
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
    headerButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
    list: { padding: SPACING.lg, flexGrow: 1 },
    item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: SPACING.md,
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    itemUnread: { borderColor: COLORS.primary },
    iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    itemTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.dark },
    itemBody: { fontSize: FONT_SIZES.sm, color: COLORS.dark, opacity: 0.85, marginTop: 2, lineHeight: 18 },
    itemTime: { fontSize: 11, color: COLORS.textSecondary, marginTop: SPACING.xs },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, marginTop: 6 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl, gap: SPACING.sm },
    emptyTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.dark },
    emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  });
