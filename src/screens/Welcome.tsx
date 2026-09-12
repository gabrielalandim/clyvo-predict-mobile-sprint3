import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;
interface Props {
  navigation: WelcomeScreenNavigationProp;
}
const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.logo}>CLYVO</Text>
          <Text style={styles.logoSub}>PREDICT</Text>
          <Text style={styles.tagline}>Do Reativo ao Preventivo</Text>

          <View style={styles.scoreOuterCircle}>
            <View style={styles.scoreInnerCircle}>
              <Text style={styles.scoreNumber}>95</Text>
              <Text style={styles.scoreLabel}>Score Saúde</Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="ribbon" size={20} color={COLORS.white} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Score de Saúde 0-100</Text>
                <Text style={styles.featureSub}>Acompanhe a saúde do seu pet</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="chatbubble" size={20} color={COLORS.white} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Alertas via WhatsApp</Text>
                <Text style={styles.featureSub}>IA personalizada por raça</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="id-card" size={20} color={COLORS.white} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Carteira Digital</Text>
                <Text style={styles.featureSub}>Histórico completo sempre acessível</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.primaryButtonText}>Iniciar Jornada</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: SPACING.xxl,
      paddingTop: 40,
    },
    logo: {
      fontSize: 40,
      fontWeight: '700',
      color: COLORS.primary,
      letterSpacing: 1,
    },
    logoSub: {
      fontSize: 22,
      fontWeight: '700',
      color: COLORS.secondary,
      marginTop: -5,
      letterSpacing: 2,
    },
    tagline: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.primary,
      marginTop: SPACING.xl,
      fontWeight: '600',
      fontStyle: 'italic',
    },
    scoreOuterCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 8,
      borderColor: COLORS.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 40,
      backgroundColor: COLORS.white,
      shadowColor: COLORS.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 4,
    },
    scoreInnerCircle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreNumber: {
      fontSize: 64,
      fontWeight: '800',
      color: COLORS.secondary,
    },
    scoreLabel: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      fontWeight: '500',
      marginTop: -5,
    },
    featuresContainer: {
      width: '100%',
      gap: SPACING.lg,
      paddingHorizontal: SPACING.xs,
      marginBottom: SPACING.xl,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: COLORS.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    featureTextContainer: {
      flex: 1,
    },
    featureTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '700',
      color: COLORS.dark,
    },
    featureSub: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginTop: 2,
    },
    footer: {
      paddingHorizontal: SPACING.xxl,
      paddingBottom: 40,
      gap: SPACING.md,
      backgroundColor: COLORS.white,
    },
    primaryButton: {
      backgroundColor: COLORS.secondary,
      padding: SPACING.lg,
      borderRadius: 20,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: COLORS.white,
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
    },
  });
export default WelcomeScreen;
