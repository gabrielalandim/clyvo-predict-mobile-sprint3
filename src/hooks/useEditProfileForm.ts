import { useEffect, useState } from 'react';
import { FormResult } from '@models/FormResult';
import { Tutor } from '@models/Tutor';
import { isValidEmail, isValidPassword, isValidPhone, maskPhone, MIN_PASSWORD_LENGTH } from '@utils/validation';
import { useTutor, useUpdateTutorProfile } from './useTutorProfile';

export type EditProfileMode = 'profile' | 'password';

export function useEditProfileForm(mode: EditProfileMode) {
  const { data: tutor, isLoading, error: loadError } = useTutor();
  const updateProfile = useUpdateTutorProfile();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefoneRaw] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    if (!tutor) return;
    setNome(tutor.nome);
    setEmail(tutor.email);
    setTelefoneRaw(maskPhone(tutor.telefone));
  }, [tutor]);

  const setTelefone = (text: string) => setTelefoneRaw(maskPhone(text));

  const validate = (): string | null => {
    if (!senhaAtual) return 'Informe sua senha atual para confirmar a alteração.';
    if (mode === 'profile') {
      if (!nome.trim() || !email.trim() || !telefone.trim()) return 'Preencha nome, e-mail e telefone.';
      if (!isValidEmail(email)) return 'Informe um e-mail válido.';
      if (!isValidPhone(telefone)) return 'Informe um telefone com DDD.';
    } else {
      if (!isValidPassword(novaSenha)) return `A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
      if (novaSenha !== confirmarSenha) return 'A confirmação não confere com a nova senha.';
      if (novaSenha === senhaAtual) return 'A nova senha precisa ser diferente da atual.';
    }
    return null;
  };

  const submit = async (): Promise<FormResult<Tutor>> => {
    const validationError = validate();
    if (validationError) return { ok: false, title: 'Confira os dados', message: validationError };
    if (!tutor) return { ok: false, title: 'Erro', message: 'Seus dados ainda não foram carregados.' };
    const data =
      mode === 'profile'
        ? { nome: nome.trim(), email: email.trim(), telefone: telefone.trim() }
        : { nome: tutor.nome, email: tutor.email, telefone: tutor.telefone };
    try {
      const updated = await updateProfile.mutateAsync({
        currentPassword: senhaAtual,
        data,
        newPassword: mode === 'password' ? novaSenha : undefined,
      });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      return {
        ok: true,
        data: updated,
        message: mode === 'profile' ? 'Seus dados foram atualizados.' : 'Sua senha foi alterada.',
      };
    } catch (error) {
      return { ok: false, title: 'Não foi possível salvar', message: (error as Error).message };
    }
  };

  return {
    isLoading,
    loadError,
    saving: updateProfile.isPending,
    nome,
    setNome,
    email,
    setEmail,
    telefone,
    setTelefone,
    senhaAtual,
    setSenhaAtual,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    submit,
  };
}
