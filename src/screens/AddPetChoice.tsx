import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'AddPetChoice'>;
};
const AddPetChoiceScreen: React.FC<Props> = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Cadastrar Pet</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.heading}>Vamos começar?</Text>
        <Text style={styles.subheading}>Escolha como deseja cadastrar seu pet.</Text>

        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddPet', { mode: 'manual' })}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary}18` }]}>
            <Ionicons name="clipboard-outline" size={30} color={COLORS.primary} />
          </View>
          <Text style={styles.optionTitle}>Cadastrar pet manualmente</Text>
          <Text style={styles.optionDesc}>Preencha as informações do seu pet passo a passo.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.optionCardHighlight]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddPet', { mode: 'photo' })}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${COLORS.secondary}18` }]}>
            <Ionicons name="camera-outline" size={30} color={COLORS.secondary} />
          </View>
          <Text style={styles.optionTitle}>Cadastrar pet com IA</Text>
          <Text style={styles.optionDesc}>
            Tire ou escolha uma foto e deixe a IA sugerir espécie, raça, cor, porte e peso estimado.
          </Text>
        </TouchableOpacity>

        <View style={styles.tipBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
          <Text style={styles.tipText}>
            Na análise por IA você sempre confirma ou edita os dados antes de salvar o cadastro.
          </Text>
        </View>
      </View>
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
      backgroundColor: COLORS.secondary,
      paddingHorizontal: SPACING.xl,
      paddingTop: 50,
      paddingBottom: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtn: { width: 32, height: 32, justifyContent: 'center' },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
    body: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
    heading: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: COLORS.dark },
    subheading: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textSecondary,
      marginTop: SPACING.xs,
      marginBottom: SPACING.xl,
    },
    optionCard: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: SPACING.xl,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      marginBottom: SPACING.lg,
      elevation: 2,
      shadowColor: '#1E2761',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    optionCardHighlight: { borderColor: COLORS.secondary },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    optionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.xs },
    optionDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 18 },
    tipBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: SPACING.sm,
      backgroundColor: `${COLORS.primary}0F`,
      borderRadius: 14,
      padding: SPACING.md,
      marginTop: SPACING.sm,
    },
    tipText: { flex: 1, fontSize: 13, color: COLORS.secondary, lineHeight: 18 },
  });
export default AddPetChoiceScreen;
