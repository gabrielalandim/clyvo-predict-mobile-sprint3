import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { ThemeColors } from '@contexts/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useErrorAlert } from '@hooks/useErrorAlert';
import { useEditProfileForm } from '@hooks/useEditProfileForm';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'EditProfile'>;
  route: RouteProp<RootStackParamList, 'EditProfile'>;
};

export default function EditProfileScreen({ navigation, route }: Props) {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const mode = route.params?.mode ?? 'profile';
  const form = useEditProfileForm(mode);
  const isPasswordMode = mode === 'password';

  useErrorAlert(form.loadError, 'Erro ao carregar seus dados');

  const handleSave = async () => {
    const result = await form.submit();
    if (!result.ok) {
      Alert.alert(result.title, result.message);
      return;
    }
    Alert.alert('Pronto!', result.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    options: Partial<React.ComponentProps<typeof TextInput>> = {},
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        {...options}
      />
    </>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{isPasswordMode ? 'Alterar Senha' : 'Editar Perfil'}</Text>
        <View style={{ width: 32 }} />
      </View>

      {form.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {isPasswordMode ? (
            <>
              {renderInput('Nova senha', form.novaSenha, form.setNovaSenha, {
                secureTextEntry: true,
                placeholder: 'Mínimo de 6 caracteres',
              })}
              {renderInput('Confirmar nova senha', form.confirmarSenha, form.setConfirmarSenha, {
                secureTextEntry: true,
                placeholder: 'Repita a nova senha',
              })}
            </>
          ) : (
            <>
              {renderInput('Nome', form.nome, form.setNome, { placeholder: 'Seu nome' })}
              {renderInput('E-mail', form.email, form.setEmail, {
                autoCapitalize: 'none',
                keyboardType: 'email-address',
                placeholder: 'seuemail@exemplo.com',
              })}
              {renderInput('Telefone', form.telefone, form.setTelefone, {
                keyboardType: 'phone-pad',
                placeholder: '(11) 91234-5678',
              })}
            </>
          )}

          <View style={styles.divider} />
          {renderInput('Senha atual', form.senhaAtual, form.setSenhaAtual, {
            secureTextEntry: true,
            placeholder: 'Confirme com sua senha atual',
          })}
          <Text style={styles.hint}>
            Por segurança, pedimos sua senha atual antes de salvar. Os dados são atualizados direto na API
            (PUT /api/tutores) e sua sessão é renovada em seguida.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={form.saving}>
            {form.saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const makeStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
      backgroundColor: COLORS.secondary,
      paddingTop: 55,
      paddingBottom: SPACING.lg,
      paddingHorizontal: SPACING.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: { width: 32, height: 32, justifyContent: 'center' },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    form: { padding: SPACING.xl, paddingBottom: 40 },
    label: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
      marginTop: SPACING.lg,
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
    divider: { height: 1, backgroundColor: COLORS.border, marginTop: SPACING.xxl },
    hint: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 18 },
    primaryButton: {
      backgroundColor: COLORS.secondary,
      padding: SPACING.lg,
      borderRadius: 24,
      alignItems: 'center',
      marginTop: SPACING.xxl,
    },
    primaryButtonText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '700' },
  });
