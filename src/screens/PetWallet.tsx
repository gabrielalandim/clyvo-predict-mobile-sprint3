import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { HealthEvent, getEventTypeConfig } from '@models/HealthEvent';
import { BottomTabBar } from '@components/BottomTabBar';
import { WalletHeader } from '@components/WalletHeader';
import { PetIdentityCard } from '@components/PetIdentityCard';
import { usePetWallet } from '@hooks/usePetWallet';
import { formatIsoDateBR } from '@utils/date';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useErrorAlert } from '@hooks/useErrorAlert';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PetWallet'>;
  route: RouteProp<RootStackParamList, 'PetWallet'>;
};
function SectionTitle({ icon, title }: { icon: string; title: string }) {
  const { styles } = useThemedStyles(makeStyles);
  return (
    <View style={styles.sectionTitle}>
      <Text style={{ fontSize: 16 }}>{icon}</Text>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );
}
function EventList({ events, emptyLabel }: { events: HealthEvent[]; emptyLabel: string }) {
  const { styles } = useThemedStyles(makeStyles);
  if (events.length === 0) {
    return <Text style={styles.listSub}>{emptyLabel}</Text>;
  }
  return (
    <>
      {events.map((evt, i) => (
        <View key={evt.id} style={[styles.listRow, i < events.length - 1 && styles.divider]}>
          <Text style={{ fontSize: 18 }}>{getEventTypeConfig(evt.tipoEvento).emoji}</Text>
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <Text style={styles.listTitle}>{evt.descricao}</Text>
            <Text style={styles.listSub}>{formatIsoDateBR(evt.dataEvento)}</Text>
          </View>
        </View>
      ))}
    </>
  );
}
export default function PetWalletScreen({ navigation, route }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const {
    pets,
    isLoading: loading,
    loadingEvents,
    petsError,
    eventsError,
    currentPet,
    selectPet,
    eventsByCategory: { vacinas, exames, consultas, outros },
    generatingPdf,
    generatePdf,
  } = usePetWallet(route.params?.petId);

  useErrorAlert(petsError, 'Erro ao carregar pets');
  useErrorAlert(eventsError, 'Erro ao carregar histórico');

  const handleGeneratePDF = async () => {
    const errorMessage = await generatePdf();
    if (errorMessage) Alert.alert('Erro ao gerar PDF', errorMessage);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <WalletHeader
          pets={pets}
          currentPet={currentPet}
          onBack={() => navigation.goBack()}
          onSelectPet={selectPet}
          onGeneratePDF={currentPet ? handleGeneratePDF : undefined}
          generatingPDF={generatingPdf}
        />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {!currentPet ? (
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Text style={styles.noPetText}>Nenhum pet selecionado.</Text>
              <Text style={styles.listSub}>Cadastre um pet na tela inicial.</Text>
            </View>
          ) : (
            <>
              <PetIdentityCard pet={currentPet} />

              {loadingEvents ? (
                <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
                  <ActivityIndicator color={COLORS.primary} />
                </View>
              ) : (
                <>
                  <View style={styles.card}>
                    <SectionTitle icon="💉" title="VACINAS" />
                    <EventList events={vacinas} emptyLabel="Nenhuma vacina registrada ainda." />
                  </View>

                  <View style={styles.card}>
                    <SectionTitle icon="🔬" title="EXAMES" />
                    <EventList events={exames} emptyLabel="Nenhum exame registrado ainda." />
                  </View>

                  <View style={styles.card}>
                    <SectionTitle icon="🩺" title="CONSULTAS" />
                    <EventList events={consultas} emptyLabel="Nenhuma consulta registrada ainda." />
                  </View>

                  <View style={styles.card}>
                    <SectionTitle icon="📋" title="OUTROS REGISTROS" />
                    <EventList events={outros} emptyLabel="Nenhum outro registro." />
                  </View>
                </>
              )}

              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate('AddHealthEvent', { petId: currentPet.id })}
              >
                <Text style={styles.ctaButtonText}>+ Registrar Novo Evento</Text>
              </TouchableOpacity>

              <Text style={styles.footerNote}>
                Esta carteirinha reflete o histórico de eventos de saúde cadastrado no app. Toque em "📄 PDF" no topo
                para gerar e compartilhar um resumo em PDF.
              </Text>
            </>
          )}
        </ScrollView>

        <BottomTabBar activeRoute="PetWallet" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: SPACING.xl, paddingBottom: 32 },
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
    sectionTitleText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 0.8 },
    listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
    divider: { borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    listTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.dark },
    listSub: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    ctaButton: {
      backgroundColor: COLORS.secondary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    ctaButtonText: { color: COLORS.onPrimary, fontSize: FONT_SIZES.lg, fontWeight: '700' },
    footerNote: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
      marginBottom: 16,
    },
    noPetText: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
  });