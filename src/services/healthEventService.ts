import { api, extractApiErrorMessage } from './api';
import { HealthEvent, HealthEventApiDTO, TipoEvento, getEventTypeConfig } from '@models/HealthEvent';
interface PageResponse<T> {
  content: T[];
}
function toViewModel(dto: HealthEventApiDTO): HealthEvent {
  return {
    id: String(dto.id),
    petId: String(dto.petId),
    tipoEvento: dto.tipoEvento,
    descricao: dto.descricao,
    dataEvento: dto.dataEvento,
    deltaScore: getEventTypeConfig(dto.tipoEvento).impactoScore,
  };
}
export const healthEventService = {
  async listByPet(petId: string): Promise<HealthEvent[]> {
    try {
      const { data } = await api.get<PageResponse<HealthEventApiDTO>>(`/eventos/pet/${petId}`, {
        params: { size: 200, sort: 'dataEvento,desc' },
      });
      return data.content.map(toViewModel);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível carregar o histórico de saúde.'));
    }
  },
  async create(petId: string, tipoEvento: TipoEvento, descricao: string, dataEvento: string): Promise<HealthEvent> {
    try {
      const { data } = await api.post<HealthEventApiDTO>('/eventos', {
        petId: Number(petId),
        tipoEvento,
        descricao,
        dataEvento,
      });
      return toViewModel(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível salvar o evento de saúde.'));
    }
  },
  async update(
    id: string,
    petId: string,
    tipoEvento: TipoEvento,
    descricao: string,
    dataEvento: string
  ): Promise<HealthEvent> {
    try {
      const { data } = await api.put<HealthEventApiDTO>(`/eventos/${id}`, {
        petId: Number(petId),
        tipoEvento,
        descricao,
        dataEvento,
      });
      return toViewModel(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível atualizar o evento de saúde.'));
    }
  },
  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/eventos/${id}`);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível excluir o evento de saúde.'));
    }
  },
};

