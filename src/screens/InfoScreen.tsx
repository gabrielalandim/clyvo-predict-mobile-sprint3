import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { INFO_PAGES } from '@constants/infoContent';
import { ThemeColors } from '@contexts/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Info'>;
  route: RouteProp<RootStackParamList, 'Info'>;
};

export default function InfoScreen({ navigation, route }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const page = INFO_PAGES[route.params.topic];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{page.title}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introRow}>
          <Ionicons name={page.icon} size={28} color={COLORS.primary} />
          <Text style={styles.intro}>{page.intro}</Text>
        </View>
        {page.sections.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardBody}>{section.body}</Text>
          </View>
        ))}
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
    introRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
    intro: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 20 },
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    cardTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.xs },
    cardBody: { fontSize: FONT_SIZES.md, color: COLORS.dark, lineHeight: 21, opacity: 0.85 },
  });
