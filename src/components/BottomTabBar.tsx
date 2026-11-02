import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { useThemedStyles } from '@hooks/useThemedStyles';
type TabRoute = 'Home' | 'PetWallet' | 'PetHistory' | 'TutorProfile';
interface BottomTabBarProps {
  activeRoute: TabRoute;
  navigation: StackNavigationProp<RootStackParamList>;
  petId?: string;
}
const TABS: { route: TabRoute; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; usesPet: boolean }[] = [
  { route: 'Home', label: 'Home', icon: 'home', usesPet: false },
  { route: 'PetWallet', label: 'Carteira', icon: 'clipboard-outline', usesPet: true },
  { route: 'PetHistory', label: 'Histórico', icon: 'bar-chart-outline', usesPet: true },
  { route: 'TutorProfile', label: 'Perfil', icon: 'person-outline', usesPet: false },
];
export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeRoute, navigation, petId }) => {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);

  const openTab = (route: TabRoute, usesPet: boolean) => {
    if (route === activeRoute) return;
    const params = usesPet && petId ? { petId } : undefined;
    const alreadyInStack = navigation.getState().routes.some((r) => r.name === route);
    if (alreadyInStack) {
      navigation.popTo(route as any, params as any);
    } else {
      navigation.navigate(route as any, params as any);
    }
  };

  return (
    <View style={styles.bottomTabBar}>
      {TABS.map((tab) => {
        const isActive = activeRoute === tab.route;
        return (
          <TouchableOpacity key={tab.route} style={styles.tabItem} onPress={() => openTab(tab.route, tab.usesPet)}>
            <Ionicons name={tab.icon} size={24} color={isActive ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    bottomTabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      paddingVertical: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingBottom: 24,
      elevation: 10,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    tabLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, fontWeight: '500' },
    tabLabelActive: { color: COLORS.primary, fontWeight: '600' },
  });
