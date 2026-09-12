import React, { useState } from 'react';
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
import { RootStackParamList } from '@navigation/types';
import { SPACING, FONT_SIZES } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
import { useAuth } from '@contexts/AuthContext';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
};
const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = makeStyles(COLORS);
  const { register, login } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await register({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), senha });
      await login(email.trim(), senha);
    } catch (error: any) {
      Alert.alert('Não foi possível cadastrar', error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Cadastre-se para acompanhar a saúde do seu pet.</Text>

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

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(11) 91234-5678"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Crie uma senha"
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
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
    primaryButtonText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '700' },
    linkButton: { marginTop: SPACING.lg, alignItems: 'center' },
    linkText: { color: COLORS.primary, fontWeight: '600' },
  });
export default RegisterScreen;
