import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { SPACING, FONT_SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '../components/BottomBarTab';
import { useTheme } from '@contexts/ThemeContext';
import { useAuth } from '@contexts/AuthContext';
import { useState } from 'react';
import { usePets } from '@hooks/usePets';
import { useQueries } from '@tanstack/react-query';
import { healthEventKeys } from '@hooks/useHealthEvents';
import { healthEventService } from '@services/healthEventService';
type TutorProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'tutorProfile'>;
type Props = {
  navigation: TutorProfileScreenNavigationProp;
};
export default function TutorProfileScreen({ navigation }: Props) {
  const { isDark, colors: COLORS, toggleTheme } = useTheme();
  const styles = makeStyles(COLORS);
  const { session, logout } = useAuth();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState<boolean>(true);

  const { data: pets = [] } = usePets();
  const petCount = pets.length;

  const eventQueries = useQueries({
    queries: pets.map((p) => ({
      queryKey: healthEventKeys.byPet(p.id),
      queryFn: () => healthEventService.listByPet(p.id),
    })),
  });
  const eventCount = eventQueries.reduce((total, q) => total + (q.data?.length ?? 0), 0);

  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Tem certeza que deseja fechar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.mainWrapper}>
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.largeHeader}>
            <View style={styles.headerTopRow}>
              <View style={styles.brandContainer}>
                <View style={styles.logoIconContainer}>
                  <Ionicons name="paw" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.appName}>ClyvoPredict</Text>
              </View>

              <TouchableOpacity style={styles.profilePill} activeOpacity={0.8}>
                <View style={styles.profilePillAvatar}>
                  <Ionicons name="person" size={14} color={COLORS.primary} />
                </View>
                <View style={styles.profilePillText}>
                  <Text style={styles.profilePillName}>{session?.nome?.split(' ')[0] ?? 'Tutor'}</Text>
                  <Text style={styles.profilePillSub}>{session?.email ?? 'Ver perfil'}</Text>
                </View>
                <Ionicons name="chevron-down" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{petCount}</Text>
                <Text style={styles.statLabel}>Pets</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{eventCount}</Text>
                <Text style={styles.statLabel}>Eventos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Free</Text>
                <Text style={styles.statLabel}>Plano</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentBody}>
            <Text style={styles.sectionHeader}>MINHA CONTA</Text>
            <View style={styles.menuGroup}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="person-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Editar Perfil</Text>
                    <Text style={styles.menuItemSubtitle}>Nome, email, telefone</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="paw-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Meus Pets</Text>
                    <Text style={styles.menuItemSubtitle}>
                      {petCount} {petCount === 1 ? 'cadastrado' : 'cadastrados'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="key-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Alterar Senha</Text>
                    <Text style={styles.menuItemSubtitle}>Segurança da conta</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>
            </View>

            <View style={styles.premiumCard}>
              <View style={styles.premiumCardLeft}>
                <Ionicons name="star" size={24} color="#F5B041" />
                <View>
                  <Text style={styles.premiumTitle}>Plano Gratuito</Text>
                  <Text style={styles.premiumSubtitle}>Até 3 pets · Score básico</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.premiumButton} activeOpacity={0.8}>
                <Text style={styles.premiumButtonText}>Ver Premium</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>PREFERÊNCIAS</Text>
            <View style={styles.menuGroup}>
              <View style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Notificações</Text>
                    <Text style={styles.menuItemSubtitle}>Push notifications</Text>
                  </View>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#D5D8DC', true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.rowDivider} />

              <View style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="logo-whatsapp" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Alertas WhatsApp</Text>
                    <Text style={styles.menuItemSubtitle}>Lembretes no WhatsApp</Text>
                  </View>
                </View>
                <Switch
                  value={whatsappAlerts}
                  onValueChange={setWhatsappAlerts}
                  trackColor={{ false: '#D5D8DC', true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.rowDivider} />

              <View style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="moon-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Tema Escuro</Text>
                    <Text style={styles.menuItemSubtitle}>Interface noturna</Text>
                  </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#D5D8DC', true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>SUPORTE & LEGAL</Text>
            <View style={styles.menuGroup}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="help-circle-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Central de Ajuda</Text>
                    <Text style={styles.menuItemSubtitle}>Dúvidas frequentes</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Termos de Uso</Text>
                    <Text style={styles.menuItemSubtitle}>Leia nossos termos</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Privacidade (LGPD)</Text>
                    <Text style={styles.menuItemSubtitle}>Seus dados</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="information-circle-outline" size={22} color={COLORS.primary} />
                  <View style={styles.textBlock}>
                    <Text style={styles.menuItemTitle}>Sobre o App</Text>
                    <Text style={styles.menuItemSubtitle}>v1.0.0 · FIAP 2026</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.accent || '#E74C3C'} />
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </TouchableOpacity>

            <Text style={styles.footerInstitution}>CLYVO Predict · v1.0.0 · FIAP Challenge 2026</Text>
          </View>
        </ScrollView>

        <BottomTabBar activeRoute="tutorProfile" navigation={navigation} petId="" />
      </View>
    </SafeAreaView>
  );
}
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: COLORS.background },
    mainWrapper: { flex: 1 },
    scrollArea: { flex: 1 },
    largeHeader: {
      backgroundColor: COLORS.secondary,
      paddingHorizontal: SPACING.xl,
      paddingTop: 55,
      paddingBottom: SPACING.xl,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
    },
    headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 32,
    },
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    logoIconContainer: {
      width: 42,
      height: 42,
      backgroundColor: COLORS.white,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    appName: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.white,
      letterSpacing: 0.5,
    },
    profilePill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 24,
      gap: 8,
    },
    profilePillAvatar: {
      width: 28,
      height: 28,
      backgroundColor: COLORS.white,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profilePillText: {
      justifyContent: 'center',
    },
    profilePillName: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.white,
    },
    profilePillSub: {
      fontSize: 10,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: SPACING.sm,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 22,
      fontWeight: '700',
      color: COLORS.white,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.65)',
      fontWeight: '500',
    },
    statDivider: {
      width: 1,
      height: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    contentBody: {
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.md,
      paddingBottom: 40,
    },
    sectionHeader: {
      fontSize: 11,
      fontWeight: '700',
      color: '#7F8C8D',
      letterSpacing: 1,
      marginBottom: SPACING.sm,
      marginTop: SPACING.xl,
      paddingLeft: 4,
    },
    menuGroup: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      overflow: 'hidden',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.02,
      shadowRadius: 3,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      paddingHorizontal: SPACING.lg,
      backgroundColor: COLORS.white,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      flex: 1,
    },
    textBlock: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.dark,
      marginBottom: 2,
    },
    menuItemSubtitle: {
      fontSize: 12,
      color: '#95A5A6',
    },
    rowDivider: {
      height: 1,
      backgroundColor: COLORS.background,
      marginHorizontal: SPACING.lg,
    },
    premiumCard: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: SPACING.lg,
      elevation: 2,
    },
    premiumCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    premiumTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '700',
      color: COLORS.dark,
      marginBottom: 2,
    },
    premiumSubtitle: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    premiumButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
    },
    premiumButtonText: {
      color: COLORS.white,
      fontSize: 12,
      fontWeight: '700',
    },
    logoutButton: {
      backgroundColor: '#FDEDEC',
      borderWidth: 1,
      borderColor: '#FADBD8',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.lg,
      gap: SPACING.sm,
      marginTop: SPACING.xl * 1.6,
    },
    logoutButtonText: {
      color: COLORS.accent || '#E74C3C',
      fontSize: FONT_SIZES.md,
      fontWeight: '700',
    },
    footerInstitution: {
      textAlign: 'center',
      fontSize: 11,
      color: '#BDC3C7',
      marginTop: SPACING.xl,
      fontWeight: '500',
    },
  });
