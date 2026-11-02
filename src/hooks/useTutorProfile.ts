import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@contexts/AuthContext';
import { authService } from '@services/authService';
import { tutorService } from '@services/tutorService';
import { TutorUpdatePayload } from '@models/Tutor';

export const tutorKeys = {
  detail: (id: number) => ['tutor', id] as const,
};

export function useTutor() {
  const { session } = useAuth();
  return useQuery({
    queryKey: tutorKeys.detail(session?.id ?? 0),
    queryFn: () => tutorService.getById(session!.id),
    enabled: !!session,
  });
}

interface UpdateProfileInput {
  currentPassword: string;
  data: Omit<TutorUpdatePayload, 'senha'>;
  newPassword?: string;
}

export function useUpdateTutorProfile() {
  const { session, login } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ currentPassword, data, newPassword }: UpdateProfileInput) => {
      if (!session) throw new Error('Sessão expirada. Faça login novamente.');
      try {
        await authService.login(session.email, currentPassword);
      } catch {
        throw new Error('Senha atual incorreta.');
      }
      const senha = newPassword ?? currentPassword;
      const tutor = await tutorService.update(session.id, { ...data, senha });
      await login(tutor.email, senha);
      return tutor;
    },
    onSuccess: (tutor) => {
      queryClient.setQueryData(tutorKeys.detail(tutor.id), tutor);
    },
  });
}
