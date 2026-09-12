import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { SPACING, FONT_SIZES, getScoreColor } from '@constants/theme';
import { FactorBar } from '@components/FactorBar';
import { ScoreInfoModal } from '@components/ScoreInfoModal';
import { NotesSection } from '@components/NotesSection';
import { Ionicons } from '@expo/vector-icons';
import { getEventTypeConfig } from '@models/HealthEvent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@contexts/ThemeContext';
import { usePet, useDeletePet } from '@hooks/usePets';
import { useHealthEvents, useDeleteHealthEvent } from '@hooks/useHealthEvents';

type PetDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'PetDetails'>;
type PetDetailsRouteProp = RouteProp<RootStackParamList, 'PetDetails'>;
interface Props {
  navigation: PetDetailsNavigationProp;
  route: PetDetailsRouteProp;
}
interface AnotacaoData {
  id: number;
  texto: string;
  dataCriacao?: string;
}
const PetDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const { petId } = route.params;

  const { data: pet, isLoading: petLoading, error: petError, refetch: refetchPet } = usePet(petId);
  const { data: events = [], error: eventsError, refetch: refetchEvents } = useHealthEvents(petId);
  const deletePetMutation = useDeletePet();
  const deleteEventMutation = useDeleteHealthEvent();

  const [anotacoesList, setAnotacoesList] = useState<AnotacaoData[]>([]);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchPet();
      refetchEvents();
      handleGetNotes();
    });
    return unsubscribe;
  }, [navigation, refetchPet, refetchEvents]);

  useEffect(() => {
    if (petError) Alert.alert('Erro', (petError as Error).message);
  }, [petError]);

  useEffect(() => {
    if (eventsError) Alert.alert('Erro ao carregar histórico', (eventsError as Error).message);
  }, [eventsError]);

  const handleGetNotes = async () => {
    try {
      const key = `@pet_notes_${petId}`;
      const localNotes = await AsyncStorage.getItem(key);
      setAnotacoesList(localNotes ? JSON.parse(localNotes) : []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenMenu = () => {
    if (!pet) return;
    Alert.alert(`Gerenciar ${pet.name}`, 'Escolha uma das opções abaixo:', [
      {
        text: 'Editar Pet',
        onPress: () => navigation.navigate('AddPet', { mode: 'edit', petId: pet.id }),
      },
      {
        text: 'Deletar Pet',
        style: 'destructive',
        onPress: () => handleConfirmDelete(),
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ]);
  };

  const handleConfirmDelete = () => {
    if (!pet) return;
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja deletar o(a) ${pet.name}? Isso apagará todos os registros definitivamente.`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Deletar',
          style: 'destructive',
          onPress: () => {
            deletePetMutation.mutate(pet.id, {
              onSuccess: () => {
                Alert.alert('Sucesso', 'Pet removido com sucesso!', [
                  { text: 'OK', onPress: () => navigation.navigate('Home') },
                ]);
              },
              onError: (error: any) => Alert.alert('Erro', error.message),
            });
          },
        },
      ],
    );
  };

  const handleOpenEventMenu = (evt: (typeof events)[number]) => {
    Alert.alert('Gerenciar evento', 'O que você quer fazer com esse registro?', [
      {
        text: 'Editar',
        onPress: () => {
          navigation.navigate('AddHealthEvent', {
            petId,
            editEvent: {
              id: evt.id,
              tipoEvento: evt.tipoEvento,
              descricao: evt.descricao,
              dataEvento: evt.dataEvento,
            },
          });
        },
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Confirmar exclusão', 'Tem certeza que quer excluir esse evento?', [
            { text: 'Não', style: 'cancel' },
            {
              text: 'Sim, excluir',
              style: 'destructive',
              onPress: () => {
                deleteEventMutation.mutate(
                  { id: evt.id, petId },
                  { onError: (error: any) => Alert.alert('Erro', error.message) },
                );
              },
            },
          ]);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 50) return 'Regular';
    return 'Crítico';
  };
  if (petLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  if (!pet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Dados do pet indisponíveis.</Text>
        <TouchableOpacity style={styles.backButtonText} onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        <View style={styles.headerBackground}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleOpenMenu}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.profileSection}>
            <View style={styles.photoContainer}>
              {pet.photoUri ? (
                <Image source={{ uri: pet.photoUri }} style={styles.photoImage} />
              ) : (
                <Ionicons name="paw" size={40} color={COLORS.primary} />
              )}
            </View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petSubtitle}>
              {pet.breed} • {pet.age} {pet.age === 1 ? 'ano' : 'anos'} • {pet.weight ?? '--'} kg
            </Text>
          </View>
        </View>

        <View style={styles.contentPadding}>
          <View style={styles.scoreCard}>
            <View style={[styles.scoreRing, { borderColor: getScoreColor(pet.score) }]}>
              <Text style={styles.scoreNumber}>{pet.score}</Text>
              <Text style={styles.scoreLabel}>Score Saúde</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: getScoreColor(pet.score) }]}>{getStatusText(pet.score)}!</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>BREAKDOWN DO SCORE</Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={styles.infoIconButton}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <FactorBar label="Histórico Preventivo" percentage={pet.score} color={getScoreColor(pet.score)} />
            <FactorBar
              label="% de Eventos Preventivos"
              percentage={
                events.length > 0
                  ? Math.round(
                      (events.filter((e) => ['VACINA', 'EXAME', 'CONSULTA_ROTINA'].includes(e.tipoEvento)).length /
                        events.length) *
                        100,
                    )
                  : 0
              }
              color={COLORS.primary}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>PRÓXIMA CONSULTA</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.infoText}>Nenhuma consulta agendada para os próximos dias.</Text>
          </View>

          <NotesSection petId={parseInt(pet.id, 10)} anotacoesList={anotacoesList} onSaveSuccess={handleGetNotes} />

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>HISTÓRICO DE EVENTOS</Text>
            {events.length === 0 ? (
              <Text style={styles.infoText}>Nenhum evento registrado para este pet.</Text>
            ) : (
              events.map((evt) => (
                <TouchableOpacity
                  key={evt.id}
                  style={styles.eventRowCard}
                  onLongPress={() => handleOpenEventMenu(evt)}
                  delayLongPress={350}
                >
                  <View
                    style={[
                      styles.eventIcon,
                      { backgroundColor: evt.deltaScore < 0 ? `${COLORS.accent}15` : `${COLORS.primary}15` },
                    ]}
                  >
                    <Text style={{ fontSize: FONT_SIZES.xl }}>{getEventTypeConfig(evt.tipoEvento).emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle}>{evt.descricao}</Text>
                    <Text style={styles.eventDate}>
                      {new Date(evt.dataEvento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={[styles.eventDelta, { color: evt.deltaScore < 0 ? COLORS.accent : COLORS.scoreGreen }]}>
                    {evt.deltaScore > 0 ? '+' : ''}
                    {evt.deltaScore}
                  </Text>
                </TouchableOpacity>
              ))
            )}
            {events.length > 0 && <Text style={styles.hintText}>Segure um evento pra excluir.</Text>}
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('AddHealthEvent', { petId: pet.id.toString() })}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.ctaText}>Registrar Novo Evento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ScoreInfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    errorText: { fontSize: FONT_SIZES.md, color: COLORS.dark, marginBottom: SPACING.md },
    backButtonText: { padding: SPACING.md },
    scrollArea: { flex: 1 },
    scrollPadding: { paddingBottom: SPACING.xxl },
    contentPadding: { paddingHorizontal: SPACING.xl },
    headerBackground: {
      backgroundColor: COLORS.secondary,
      paddingTop: 60,
      paddingBottom: 60,
      paddingHorizontal: SPACING.xl,
      borderBottomLeftRadius: 36,
      borderBottomRightRadius: 36,
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    backButton: { position: 'absolute', left: SPACING.xl, top: 60, zIndex: 10, width: 32, height: 32 },
    menuButton: {
      position: 'absolute',
      right: SPACING.xl,
      top: 60,
      zIndex: 10,
      width: 32,
      height: 32,
      alignItems: 'flex-end',
    },
    profileSection: { alignItems: 'center' },
    photoContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      overflow: 'hidden',
    },
    photoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    petName: { fontSize: 28, fontWeight: '700', color: COLORS.white },
    petSubtitle: { fontSize: FONT_SIZES.md, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },
    scoreCard: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      padding: SPACING.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.border,
      marginTop: -40,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    scoreRing: {
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    scoreNumber: { fontSize: 44, fontWeight: '800', color: COLORS.primary },
    scoreLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', marginTop: -2 },
    statusBadge: { marginTop: SPACING.xs },
    statusText: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
    sectionCard: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginTop: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '700',
      color: COLORS.dark,
      marginBottom: SPACING.md,
      letterSpacing: 0.5,
    },
    infoIconButton: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.xs },
    hintText: { fontSize: 12, color: COLORS.textSecondary, marginTop: SPACING.sm, fontStyle: 'italic' },
    eventRowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      marginVertical: SPACING.xs,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.background,
    },
    eventIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    eventTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.dark },
    eventDate: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    eventDelta: { fontSize: FONT_SIZES.lg, fontWeight: '700', minWidth: 40, textAlign: 'right' },
    ctaButton: {
      backgroundColor: COLORS.secondary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.lg,
      borderRadius: 20,
      gap: SPACING.sm,
      marginTop: SPACING.xl,
      marginBottom: SPACING.xl,
      elevation: 2,
    },
    ctaText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '700' },
  });
export default PetDetailsScreen;