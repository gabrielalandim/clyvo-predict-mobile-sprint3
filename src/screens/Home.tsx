import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { COLORS, SPACING, FONT_SIZES } from '@constants/theme';
import { useAuth } from '@contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '@components/BottomBarTab';
import { PlansSection } from '@components/PlansSection';
import { PetCard } from '@components/PetCard';
import { useTheme } from '@contexts/ThemeContext';
import { usePets, useDeletePet } from '@hooks/usePets';
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
interface Props {
  navigation: HomeScreenNavigationProp;
}
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const { session } = useAuth();

  const { data: pets = [], isLoading, isRefetching, error, refetch } = usePets();
  const deletePetMutation = useDeletePet();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation, refetch]);

  React.useEffect(() => {
    if (error) Alert.alert('Erro ao carregar pets', (error as Error).message);
  }, [error]);

  const handleDeletePet = (petId: string) => {
    Alert.alert(
      'Remover Pet',
      'Tem certeza absoluta de que deseja remover este pet? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            deletePetMutation.mutate(petId, {
              onError: (err: any) => Alert.alert('Erro', err.message),
            });
          },
        },
      ],
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.userName}>{session?.nome?.split(' ')[0] ?? 'Tutor'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pets</Text>
          <Text style={styles.summaryValue}>{pets.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meus Pets</Text>
        <TouchableOpacity
          style={styles.addPetButton}
          onPress={() => navigation.navigate('AddPetChoice')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color={COLORS.white} />
          <Text style={styles.addPetButtonText}>Adicionar Pet</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flexGrow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.primary]} />}
        renderItem={({ item }) => (
          <PetCard
            item={item}
            onPressDetails={() => navigation.navigate('PetDetails', { petId: item.id.toString() })}
            onPressRegisterEvent={() => navigation.navigate('AddHealthEvent', { petId: item.id.toString() })}
            onPressDelete={() => handleDeletePet(item.id)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
              <Text style={styles.emptySubtext}>Toque em Adicionar Pet para começar</Text>
            </View>
          )
        }
        ListFooterComponent={<PlansSection />}
      />

      <BottomTabBar activeRoute="Home" navigation={navigation} />
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.xl,
      paddingTop: 60,
      paddingBottom: SPACING.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    greeting: {
      fontSize: FONT_SIZES.md,
      color: COLORS.white,
      opacity: 0.9,
    },
    userName: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: '700',
      color: COLORS.white,
    },
    notificationButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 12,
      position: 'relative',
    },
    notificationBadge: {
      position: 'absolute',
      top: 10,
      right: 11,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.accent,
    },
    summary: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.lg,
    },
    summaryCard: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: SPACING.lg,
      borderRadius: 16,
    },
    summaryLabel: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.white,
      opacity: 0.9,
    },
    summaryValue: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: '700',
      color: COLORS.white,
    },
    section: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.sm,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '700',
      color: COLORS.dark,
    },
    addPetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 12,
      gap: 4,
      elevation: 2,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    addPetButtonText: {
      color: COLORS.white,
      fontSize: 13,
      fontWeight: '700',
    },
    list: {
      paddingBottom: SPACING.xl,
    },
    flexGrow: {
      flex: 1,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textSecondary,
      fontWeight: '600',
    },
    emptySubtext: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textSecondary,
      marginTop: SPACING.sm,
    },
  });
export default HomeScreen;
