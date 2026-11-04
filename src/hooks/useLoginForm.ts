import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { isValidEmail } from '@utils/validation';
import { Perfil } from '@models/Auth';

export function useLoginForm() {
  const { login } = useAuth();
  const [perfil, setPerfil] = useState<Perfil>('TUTOR');
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
      await login(email.trim(), senha, perfil);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { perfil, setPerfil, email, setEmail, senha, setSenha, loading, error, submit };
}
