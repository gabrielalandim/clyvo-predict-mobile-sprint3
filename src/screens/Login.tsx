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
import { useLoginForm } from '@hooks/useLoginForm';
import { ProfileToggle } from '@components/ProfileToggle';
import { useThemedStyles } from '@hooks/useThemedStyles';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};
const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { styles, colors: COLORS } = useThemedStyles(makeStyles);
  const { perfil, setPerfil, email, setEmail, senha, setSenha, loading, error, submit } = useLoginForm();
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>CLYVO</Text>
        <Text style={styles.logoSub}>PREDICT</Text>
        <Text style={styles.title}>Entrar</Text>
        <ProfileToggle value={perfil} onChange={setPerfil} />

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

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.primaryButton} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.onPrimary} /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const makeStyles = (COLORS: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: SPACING.xxl },
    logo: { fontSize: 34, fontWeight: '700', color: COLORS.primary, textAlign: 'center', letterSpacing: 1 },
    logoSub: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.secondary,
      textAlign: 'center',
      marginBottom: SPACING.xl,
      letterSpacing: 2,
    },
    title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: COLORS.dark, marginBottom: SPACING.xl },
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
export default LoginScreen;
