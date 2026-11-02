import { api, extractApiErrorMessage } from './api';
import { Tutor, TutorUpdatePayload } from '@models/Tutor';

export const tutorService = {
  async getById(id: number): Promise<Tutor> {
    try {
      const { data } = await api.get<Tutor>(`/tutores/${id}`);
      return data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível carregar seus dados.'));
    }
  },

  async update(id: number, payload: TutorUpdatePayload): Promise<Tutor> {
    try {
      const { data } = await api.put<Tutor>(`/tutores/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível atualizar seus dados.'));
    }
  },
};
