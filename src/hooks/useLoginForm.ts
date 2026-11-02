import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { isValidEmail } from '@utils/validation';

export function useLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || !senha) {
      setError('Preencha e-mail e senha.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), senha);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, senha, setSenha, loading, error, submit };
}
