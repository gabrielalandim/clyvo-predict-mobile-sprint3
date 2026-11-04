import { api, extractApiErrorMessage } from './api';
import { sessionStorage } from '@storage/sessionStorage';
import { Perfil, TutorAuthResponseDTO, TutorSession } from '@models/Auth';
import { isTokenExpired } from '@utils/jwt';
import { cancelAllScheduled } from './notificationService';
import { notificationInboxStorage } from '@storage/notificationInboxStorage';
export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  crmv?: string;
}

const RESOURCE_BY_PROFILE: Record<Perfil, string> = {
  TUTOR: '/tutores',
  VETERINARIO: '/veterinarios',
};
export const authService = {
  async login(email: string, senha: string, perfil: Perfil = 'TUTOR'): Promise<TutorSession> {
    try {
      const { data } = await api.post<TutorAuthResponseDTO>(`${RESOURCE_BY_PROFILE[perfil]}/login`, { email, senha });
      const session: TutorSession = { ...data, perfil: data.perfil ?? perfil };
      await sessionStorage.saveSession(session);
      return session;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível fazer login.'));
    }
  },
  async register(payload: RegisterPayload, perfil: Perfil = 'TUTOR'): Promise<void> {
    const body =
      perfil === 'VETERINARIO'
        ? { nome: payload.nome, email: payload.email, senha: payload.senha, crmv: payload.crmv }
        : { nome: payload.nome, email: payload.email, senha: payload.senha, telefone: payload.telefone };
    try {
      await api.post(RESOURCE_BY_PROFILE[perfil], body);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível criar sua conta.'));
    }
  },
  async logout(): Promise<void> {
    await sessionStorage.clearSession();
    await cancelAllScheduled().catch(() => undefined);
    await notificationInboxStorage.clear().catch(() => undefined);
  },
  async getSession(): Promise<TutorSession | null> {
    const session = await sessionStorage.getSession();
    if (session && isTokenExpired(session.token)) {
      await sessionStorage.clearSession();
      return null;
    }
    return session;
  },
};
