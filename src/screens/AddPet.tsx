import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@components/AppText';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { RACES_BY_SPECIES, SPECIES_CONFIG, getBreedIcon, Species } from '@constants/races';
import { Ionicons } from '@expo/vector-icons';
import { usePetForm } from '@hooks/usePetForm';
import { usePhotoPicker } from '@hooks/usePhotoPicker';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useErrorAlert } from '@hooks/useErrorAlert';
type AddPetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPet'>;
type AddPetScreenRouteProp = RouteProp<RootStackParamList, 'AddPet'>;
interface Props {
  navigation: AddPetScreenNavigationProp;
  route: AddPetScreenRouteProp;
}
const BODY_CONDITIONS = ['Abaixo do peso', 'Ideal', 'Acima do peso'];
const SIZES = ['Pequeno', 'Médio', 'Grande'];
const AddPetScreen: React.FC<Props> = ({ navigation, route }) => {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const mode = route.params?.mode ?? 'manual';
  const form = usePetForm(mode, route.params?.petId);
  const { formData, errors, isCustomBreed, analyzing, submitting, loadingPet } = form;
  const { choosePhoto } = usePhotoPicker();

  useErrorAlert(form.loadError, 'Erro ao carregar pet');

  const handleChoosePhoto = () =>
    choosePhoto(async (uri) => {
      const result = await form.setPhoto(uri);
      if (!result) return;
      if (result.ok) {
        Alert.alert(
          'Sugestão da IA aplicada',
          'Preenchemos o formulário com o que a IA identificou na foto. Confira e edite antes de salvar — principalmente o peso, que é só uma estimativa.',
        );
      } else {
        Alert.alert(result.title, result.message);
      }
    });

  const handleSubmit = async () => {
    const result = await form.submit();
    if (!result.ok) {
      Alert.alert(result.title, result.message);
      return;
    }
    const goNext = () => (mode === 'edit' ? navigation.goBack() : navigation.popTo('Home'));
    Alert.alert('Sucesso!', result.message, [{ text: mode === 'edit' ? 'Ver pet' : 'Ver meus pets', onPress: goNext }]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === 'photo' ? 'Cadastrar com IA' : mode === 'edit' ? 'Editar Pet' : 'Cadastrar Pet'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {loadingPet ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.form}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.photoUploadContainer}>
            <TouchableOpacity
              style={styles.photoCircle}
              onPress={handleChoosePhoto}
              activeOpacity={0.8}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : formData.photoUri ? (
                <Image source={{ uri: formData.photoUri }} style={styles.uploadedPhoto} />
              ) : (
                <Text style={styles.cameraIcon}>📷</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.photoText}>
              {mode === 'photo'
                ? analyzing
                  ? 'Analisando foto com a IA...'
                  : 'Adicionar foto do pet'
                : 'Adicionar foto (opcional)'}
            </Text>
            {mode === 'photo' && !formData.photoUri && (
              <Text style={styles.photoHint}>A IA vai sugerir espécie, raça, cor, porte e peso a partir da foto.</Text>
            )}
          </View>

          {form.aiApplied && (
            <View style={styles.aiBanner}>
              <Ionicons name="sparkles" size={16} color={COLORS.secondary} />
              <Text style={styles.aiBannerText}>
                Preenchido pela IA{form.aiConfidence != null ? ` (confiança ${Math.round(form.aiConfidence * 100)}%)` : ''}. Revise
                antes de salvar.
              </Text>
            </View>
          )}

          <Text style={styles.label}>Nome do pet *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Thor"
            placeholderTextColor={COLORS.textSecondary}
            value={formData.name}
            onChangeText={form.setName}
          />

          <Text style={styles.label}>Espécie *</Text>
          <View style={styles.chips}>
            {(['dog', 'cat', 'other'] as Species[]).map((sp) => {
              const cfg = SPECIES_CONFIG[sp];
              const isActive = formData.species === sp;
              return (
                <TouchableOpacity
                  key={sp}
                  disabled={isCustomBreed}
                  style={[
                    styles.chip,
                    isActive && { borderColor: cfg.color, backgroundColor: `${cfg.color}12` },
                    isCustomBreed && { opacity: 0.4, borderColor: COLORS.border },
                  ]}
                  onPress={() => form.selectSpecies(sp)}
                >
                  <Text style={{ fontSize: 18 }}>{cfg.emoji}</Text>
                  <Text
                    style={[
                      styles.chipText,
                      isActive && { color: cfg.color, fontWeight: '700' },
                      isCustomBreed && { color: COLORS.textSecondary },
                    ]}
                  >
                    {cfg.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.customToggleBtn}
            onPress={form.toggleCustomBreed}
            activeOpacity={0.7}
          >
            <Text style={styles.customToggleText}>
              {isCustomBreed ? 'Voltar para seleção da lista' : 'Não encontrei a espécie ou raça'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Raça *</Text>
          {isCustomBreed ? (
            <TextInput
              style={[styles.input, errors.breed && styles.inputError]}
              placeholder="Digite o nome da espécie / raça do animal"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.breed}
              maxLength={60}
              onChangeText={form.setCustomBreed}
            />
          ) : (
            <View>
              <TouchableOpacity
                style={[styles.pickerSelector, errors.breed && styles.inputError]}
                onPress={form.toggleBreedDropdown}
              >
                {formData.breed ? (
                  <View style={styles.selectedBreedRow}>
                    <Text style={styles.selectedBreedEmoji}>{getBreedIcon(formData.species, formData.breed)}</Text>
                    <Text style={styles.pickerText}>{formData.breed}</Text>
                  </View>
                ) : (
                  <Text style={[styles.pickerText, { color: COLORS.textSecondary }]}>{form.breedPlaceholder}</Text>
                )}
                <Ionicons
                  name={form.showBreedDropdown ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={errors.breed ? '#FF3B30' : COLORS.textSecondary}
                />
              </TouchableOpacity>

              {form.showBreedDropdown && (
                <View style={styles.dropdownContainer}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 240 }} showsVerticalScrollIndicator>
                    {RACES_BY_SPECIES[formData.species]?.map((breed) => (
                      <TouchableOpacity
                        key={breed}
                        style={[styles.dropdownItem, breed === formData.breed && styles.dropdownItemActive]}
                        onPress={() => form.selectBreed(breed)}
                      >
                        <Text style={styles.dropdownEmoji}>{getBreedIcon(formData.species, breed)}</Text>
                        <Text
                          style={[
                            styles.dropdownItemText,
                            breed === formData.breed && { color: COLORS.primary, fontWeight: '700' },
                          ]}
                        >
                          {breed}
                        </Text>
                        {breed === formData.breed && <Ionicons name="checkmark" size={16} color={COLORS.primary} />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 <Text style={{ fontWeight: '700' }}>Dica:</Text> A raça é importante! Nossa IA personaliza alertas
              baseados em predisposições genéticas.
            </Text>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.flexInput}>
              <Text style={styles.label}>Idade (anos) *</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="Ex: 3"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                maxLength={2}
                value={formData.age}
                editable={!formData.birthDate}
                onChangeText={form.setAge}
              />
            </View>
            <View style={[styles.flexInput, { marginLeft: SPACING.md }]}>
              <Text style={styles.label}>Peso (kg) *</Text>
              <TextInput
                style={[styles.input, errors.weight && styles.inputError]}
                placeholder="Ex: 28"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                maxLength={6}
                value={formData.weight}
                onChangeText={form.setWeight}
              />
              {form.estimatedWeight && (
                <Text style={styles.realtimeAgeText}>
                  Peso estimado pela IA: {form.estimatedWeight.min} a {form.estimatedWeight.max} kg
                </Text>
              )}
            </View>
          </View>

          <Text style={styles.label}>Data de nascimento (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/aaaa — se preencher, calculamos a idade automaticamente"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            maxLength={10}
            value={formData.birthDate}
            onChangeText={form.setBirthDate}
          />

          {mode === 'photo' && (
            <>
              <Text style={styles.label}>Cor predominante</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Caramelo"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.color}
                onChangeText={(t) => form.updateField('color', t)}
              />

              <Text style={styles.label}>Porte</Text>
              <View style={styles.chips}>
                {SIZES.map((sizeOption) => (
                  <TouchableOpacity
                    key={sizeOption}
                    style={[
                      styles.chip,
                      formData.size === sizeOption && {
                        borderColor: COLORS.primary,
                        backgroundColor: `${COLORS.primary}12`,
                      },
                    ]}
                    onPress={() => form.updateField('size', sizeOption)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        formData.size === sizeOption && { color: COLORS.primary, fontWeight: '700' },
                      ]}
                    >
                      {sizeOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Condição corporal</Text>
              <View style={styles.chips}>
                {BODY_CONDITIONS.map((cond) => (
                  <TouchableOpacity
                    key={cond}
                    style={[
                      styles.chip,
                      formData.bodyCondition === cond && {
                        borderColor: COLORS.primary,
                        backgroundColor: `${COLORS.primary}12`,
                      },
                    ]}
                    onPress={() => form.updateField('bodyCondition', cond)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        formData.bodyCondition === cond && { color: COLORS.primary, fontWeight: '700' },
                      ]}
                    >
                      {cond}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={styles.label}>Sexo *</Text>
          <View style={styles.chips}>
            <TouchableOpacity
              style={[styles.chip, formData.sex === 'male' && styles.chipActiveMale]}
              onPress={() => form.updateField('sex', 'male')}
            >
              <Text style={styles.chipText}>♂️ Macho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, formData.sex === 'female' && styles.chipActiveFemale]}
              onPress={() => form.updateField('sex', 'female')}
            >
              <Text style={styles.chipText}>♀️ Fêmea</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Castrado?</Text>
          <View style={styles.chips}>
            <TouchableOpacity
              style={[styles.chip, formData.neutered ? styles.chipActiveYes : styles.chipInactive]}
              onPress={() => form.updateField('neutered', true)}
            >
              <Text style={[styles.chipText, formData.neutered && { color: '#2E7D32' }]}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, !formData.neutered ? styles.chipActiveNo : styles.chipInactive]}
              onPress={() => form.updateField('neutered', false)}
            >
              <Text style={[styles.chipText, !formData.neutered && { color: '#D32F2F' }]}>Não</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Microchip (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 123456789012345"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            maxLength={15}
            value={formData.microchip}
            onChangeText={form.setMicrochip}
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>Observações (opcional)</Text>
            <Text style={styles.charCounter}>{formData.observations.length}/300</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Alergia a frango, medo de fogos..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={300}
            textAlignVertical="top"
            value={formData.observations}
            onChangeText={(t) => form.updateField('observations', t)}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {!loadingPet && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={submitting || analyzing}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>{mode === 'edit' ? 'Salvar Alterações' : 'Cadastrar Pet'}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
      paddingBottom: SPACING.md,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backArrow: { fontSize: FONT_SIZES.xl, color: COLORS.onPrimary, fontWeight: 'bold' },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.onPrimary },
    progressBarBackground: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
    progressBarFill: { width: '55%', height: '100%', backgroundColor: COLORS.white, borderRadius: 2 },
    form: { flex: 1, paddingHorizontal: SPACING.xl, backgroundColor: COLORS.white },
    photoUploadContainer: { alignItems: 'center', marginVertical: SPACING.xl },
    photoCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: COLORS.primary,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.background,
      marginBottom: SPACING.sm,
      overflow: 'hidden',
    },
    uploadedPhoto: { width: '100%', height: '100%', resizeMode: 'cover' },
    cameraIcon: { fontSize: 28 },
    photoText: { fontSize: FONT_SIZES.md, color: COLORS.primary, fontWeight: '600' },
    photoHint: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 4,
      textAlign: 'center',
      paddingHorizontal: SPACING.xl,
    },
    aiBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
      backgroundColor: `${COLORS.secondary}12`,
      padding: SPACING.sm,
      borderRadius: 10,
      marginBottom: SPACING.md,
    },
    aiBannerText: { flex: 1, fontSize: 12, color: COLORS.secondary, fontWeight: '600' },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
      marginTop: SPACING.lg,
    },
    charCounter: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.lg },
    input: {
      backgroundColor: COLORS.white,
      padding: SPACING.md,
      borderRadius: 14,
      fontSize: FONT_SIZES.md,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      color: COLORS.dark,
    },
    inputError: { borderColor: '#FF3B30', backgroundColor: '#FFF5F5' },
    realtimeAgeText: { fontSize: 12, fontWeight: '600', color: COLORS.primary, marginTop: 6, paddingLeft: 2 },
    customToggleBtn: { marginTop: SPACING.sm, alignSelf: 'flex-start', paddingVertical: 4 },
    customToggleText: { color: COLORS.primary, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
    chips: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs, flexWrap: 'wrap' },
    chip: {
      flex: 1,
      minWidth: 90,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
      paddingVertical: SPACING.md,
      backgroundColor: COLORS.white,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: COLORS.border,
    },
    chipInactive: { borderColor: COLORS.border, backgroundColor: COLORS.white },
    chipActiveYes: { borderColor: '#2E7D32', backgroundColor: COLORS.white },
    chipActiveNo: { borderColor: '#D32F2F', backgroundColor: COLORS.white },
    chipActiveMale: { borderColor: '#3182CE', backgroundColor: '#EBF8FF' },
    chipActiveFemale: { borderColor: '#D53F8C', backgroundColor: '#FFF5F5' },
    chipText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.dark },
    pickerSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      paddingHorizontal: SPACING.md,
      justifyContent: 'space-between',
      minHeight: 48,
    },
    selectedBreedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      flex: 1,
      paddingVertical: SPACING.md,
    },
    selectedBreedEmoji: { fontSize: 20 },
    pickerText: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.dark },
    dropdownContainer: {
      backgroundColor: COLORS.white,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      marginTop: 2,
      padding: SPACING.xs,
      overflow: 'hidden',
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      paddingVertical: 12,
      paddingHorizontal: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.background,
    },
    dropdownItemActive: { backgroundColor: `${COLORS.primary}08` },
    dropdownEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
    dropdownItemText: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.dark, fontWeight: '500' },
    tipBox: {
      backgroundColor: 'rgba(2,195,154,0.1)',
      borderLeftWidth: 4,
      borderColor: COLORS.secondary,
      padding: SPACING.md,
      borderRadius: 8,
      marginTop: SPACING.md,
    },
    tipText: { fontSize: 13, color: COLORS.primary, lineHeight: 18 },
    rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
    flexInput: { flex: 1 },
    textArea: { height: 100, paddingTop: SPACING.md },
    footerContainer: {
      paddingHorizontal: SPACING.xl,
      paddingBottom: SPACING.xl,
      paddingTop: SPACING.sm,
      backgroundColor: COLORS.white,
    },
    submitButton: { backgroundColor: COLORS.secondary, padding: SPACING.lg, borderRadius: 24, alignItems: 'center' },
    submitButtonText: { color: COLORS.onPrimary, fontSize: FONT_SIZES.lg, fontWeight: '700' },
  });
export default AddPetScreen;
