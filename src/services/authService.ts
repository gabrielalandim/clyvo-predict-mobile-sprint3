import { api, extractApiErrorMessage } from './api';
import { sessionStorage } from './session';
import { TutorAuthResponseDTO, TutorSession } from '@models/Auth';
export interface RegisterPayload {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}
export const authService = {
  async login(email: string, senha: string): Promise<TutorSession> {
    try {
      const { data } = await api.post<TutorAuthResponseDTO>('/tutores/login', { email, senha });
      const session: TutorSession = data;
      await sessionStorage.saveSession(session);
      return session;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível fazer login.'));
    }
  },
  async register(payload: RegisterPayload): Promise<void> {
    try {
      await api.post('/tutores', payload);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível criar sua conta.'));
    }
  },
  async logout(): Promise<void> {
    await sessionStorage.clearSession();
  },
  async getSession() {
    return sessionStorage.getSession();
  },
};
