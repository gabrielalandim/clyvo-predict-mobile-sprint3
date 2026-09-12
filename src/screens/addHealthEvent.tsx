import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { healthEventService } from '@services/healthEventService';
import { EVENT_TYPES, TipoEvento } from '@models/HealthEvent';
import { maskDateInput, isValidDateInput, toIsoDate } from '@utils/dateInput';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
type AddHealthEventNavigationProp = StackNavigationProp<RootStackParamList, 'AddHealthEvent'>;
type AddHealthEventRouteProp = RouteProp<RootStackParamList, 'AddHealthEvent'>;
interface Props {
  navigation: AddHealthEventNavigationProp;
  route: AddHealthEventRouteProp;
}
const AddHealthEventScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const { petId } = route.params;
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<TipoEvento>('VACINA');
  const [dataTexto, setDataTexto] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleDateChange = (text: string) => {
    setDataTexto(maskDateInput(text));
  };
  const handleSubmit = async () => {
    if (!descricao.trim() || !isValidDateInput(dataTexto)) {
      Alert.alert('Erro', 'Preencha a descrição e uma data válida (dd/mm/aaaa).');
      return;
    }
    setSubmitting(true);
    try {
      await healthEventService.create(petId, tipo, descricao.trim(), toIsoDate(dataTexto));
      Alert.alert('Sucesso!', 'Evento salvo e o score do pet foi atualizado.', [
        { text: 'Perfeito', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Evento</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>O que aconteceu? *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Vacina V10, Antirrábica..."
          placeholderTextColor={COLORS.textSecondary}
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Data do Evento *</Text>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/aaaa"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
          maxLength={10}
          value={dataTexto}
          onChangeText={handleDateChange}
        />

        <Text style={styles.label}>Categoria do Evento *</Text>
        <View style={styles.grid}>
          {EVENT_TYPES.map((item) => {
            const isSelected = tipo === item.value;
            const isNegative = item.impactoScore < 0;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  isSelected && isNegative && styles.cardNegative,
                ]}
                onPress={() => setTipo(item.value)}
              >
                <Ionicons name={item.icon as any} size={24} color={isSelected ? COLORS.white : COLORS.primary} />
                <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>{item.label}</Text>
                <Text style={[styles.cardImpact, isSelected && styles.cardImpactSelected]}>
                  {item.impactoScore > 0 ? '+' : ''}
                  {item.impactoScore} pts
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🐾 <Text style={{ fontWeight: '700' }}>Sincronizado com a API:</Text> este evento é salvo direto no backend
            (POST /api/eventos) e o Score de Saúde do pet é recalculado pelo servidor.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Salvar Evento</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
      backgroundColor: COLORS.primary,
      paddingTop: 50,
      paddingBottom: SPACING.md,
      paddingHorizontal: SPACING.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: { padding: 4 },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
    form: { flex: 1, paddingHorizontal: SPACING.xl },
    label: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.dark,
      marginTop: SPACING.xl,
      marginBottom: SPACING.sm,
    },
    input: {
      backgroundColor: COLORS.white,
      padding: SPACING.md,
      borderRadius: 14,
      fontSize: FONT_SIZES.md,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      color: COLORS.dark,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, justifyContent: 'space-between' },
    card: {
      width: '47%',
      backgroundColor: COLORS.background,
      borderRadius: 16,
      padding: SPACING.lg,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    cardSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.secondary },
    cardNegative: { backgroundColor: COLORS.scoreRed, borderColor: '#C53030' },
    cardText: { fontSize: 14, fontWeight: '600', color: COLORS.dark, marginTop: SPACING.sm },
    cardTextSelected: { color: COLORS.white },
    cardImpact: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginTop: 2 },
    cardImpactSelected: { color: 'rgba(255,255,255,0.85)' },
    infoBox: {
      backgroundColor: 'rgba(40, 159, 206, 0.1)',
      borderLeftWidth: 4,
      borderColor: COLORS.primary,
      padding: SPACING.md,
      borderRadius: 8,
      marginVertical: SPACING.xxl,
    },
    infoText: { fontSize: 13, color: COLORS.secondary, lineHeight: 18 },
    footer: { padding: SPACING.xl, backgroundColor: COLORS.white },
    submitButton: { backgroundColor: COLORS.secondary, padding: SPACING.lg, borderRadius: 24, alignItems: 'center' },
    submitButtonText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '700' },
  });
export default AddHealthEventScreen;
