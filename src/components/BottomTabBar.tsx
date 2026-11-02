import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { useTheme } from '@contexts/ThemeContext';
interface BottomTabBarProps {
  activeRoute: 'Home' | 'PetWallet' | 'PetHistory' | 'TutorProfile';
  navigation: StackNavigationProp<RootStackParamList>;
  petId?: string;
}
export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeRoute, navigation, petId }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  return (
    <View style={styles.bottomTabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color={activeRoute === 'Home' ? COLORS.primary : COLORS.textSecondary} />
        <Text style={[styles.tabLabel, activeRoute === 'Home' && styles.tabLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('PetWallet', petId ? { petId } : undefined)}
      >
        <Ionicons
          name="clipboard-outline"
          size={24}
          color={activeRoute === 'PetWallet' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.tabLabel, activeRoute === 'PetWallet' && styles.tabLabelActive]}>Carteira</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('PetHistory', petId ? { petId } : undefined)}
      >
        <Ionicons
          name="bar-chart-outline"
          size={24}
          color={activeRoute === 'PetHistory' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.tabLabel, activeRoute === 'PetHistory' && styles.tabLabelActive]}>Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TutorProfile')}>
        <Ionicons
          name="person-outline"
          size={24}
          color={activeRoute === 'TutorProfile' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.tabLabel, activeRoute === 'TutorProfile' && styles.tabLabelActive]}>Perfil</Text>
      </TouchableOpacity>
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
