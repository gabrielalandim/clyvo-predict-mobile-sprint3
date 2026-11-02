import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { isValidEmail, isValidPassword, isValidPhone, maskPhone, MIN_PASSWORD_LENGTH } from '@utils/validation';

export function useRegisterForm() {
  const { register, login } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefoneRaw] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setTelefone = (text: string) => setTelefoneRaw(maskPhone(text));

  const validate = (): string | null => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !senha) return 'Preencha todos os campos.';
    if (!isValidEmail(email)) return 'Informe um e-mail válido.';
    if (!isValidPhone(telefone)) return 'Informe um telefone com DDD.';
    if (!isValidPassword(senha)) return `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    return null;
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), senha });
      await login(email.trim(), senha);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { nome, setNome, email, setEmail, telefone, setTelefone, senha, setSenha, loading, error, submit };
}
