import React from 'react';
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text } from '@components/AppText';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { useRegisterForm } from '@hooks/useRegisterForm';
import { ProfileToggle } from '@components/ProfileToggle';
import { useThemedStyles } from '@hooks/useThemedStyles';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
};
const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const {
    perfil,
    setPerfil,
    crmv,
    setCrmv,
    nome,
    setNome,
    email,
    setEmail,
    telefone,
    setTelefone,
    senha,
    setSenha,
    loading,
    error,
    submit,
  } = useRegisterForm();
  const isVet = perfil === 'VETERINARIO';
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          {isVet
            ? 'Cadastre-se para acompanhar a saúde dos seus pacientes.'
            : 'Cadastre-se para acompanhar a saúde do seu pet.'}
        </Text>

        <ProfileToggle value={perfil} onChange={setPerfil} />

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor={COLORS.textSecondary}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@exemplo.com"
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {isVet ? (
          <>
            <Text style={styles.label}>CRMV</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: SP-12345"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="characters"
              value={crmv}
              onChangeText={setCrmv}
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(11) 91234-5678"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />
          </>
        )}

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo de 6 caracteres"
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.primaryButton} onPress={submit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.onPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.xxl },
    title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: COLORS.dark },
    subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.md },
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
    primaryButton: {
      backgroundColor: COLORS.secondary,
      padding: SPACING.lg,
      borderRadius: 24,
      alignItems: 'center',
      marginTop: SPACING.xxl,
    },
    primaryButtonText: { color: COLORS.onPrimary, fontSize: FONT_SIZES.lg, fontWeight: '700' },
    errorText: { color: COLORS.accent, fontSize: FONT_SIZES.sm, marginTop: SPACING.md, fontWeight: '600' },
    linkButton: { marginTop: SPACING.lg, alignItems: 'center' },
    linkText: { color: COLORS.primary, fontWeight: '600' },
  });
export default RegisterScreen;
