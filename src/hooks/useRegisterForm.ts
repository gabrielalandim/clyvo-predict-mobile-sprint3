import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { isValidEmail, isValidPassword, isValidPhone, maskPhone, MIN_PASSWORD_LENGTH } from '@utils/validation';
import { Perfil } from '@models/Auth';

export function useRegisterForm() {
  const { register, login } = useAuth();
  const [perfil, setPerfil] = useState<Perfil>('TUTOR');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefoneRaw] = useState('');
  const [crmv, setCrmv] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setTelefone = (text: string) => setTelefoneRaw(maskPhone(text));

  const validate = (): string | null => {
    const isVet = perfil === 'VETERINARIO';
    const documento = isVet ? crmv.trim() : telefone.trim();
    if (!nome.trim() || !email.trim() || !documento || !senha) return 'Preencha todos os campos.';
    if (!isValidEmail(email)) return 'Informe um e-mail válido.';
    if (!isVet && !isValidPhone(telefone)) return 'Informe um telefone com DDD.';
    if (isVet && crmv.trim().length < 4) return 'Informe um CRMV válido.';
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
      await register(
        { nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), crmv: crmv.trim().toUpperCase(), senha },
        perfil,
      );
      await login(email.trim(), senha, perfil);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { perfil, setPerfil, crmv, setCrmv, nome, setNome, email, setEmail, telefone, setTelefone, senha, setSenha, loading, error, submit };
}
