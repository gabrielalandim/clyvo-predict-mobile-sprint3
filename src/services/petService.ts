import { api, extractApiErrorMessage } from './api';
import { AI_ANALYSIS_TIMEOUT_MS } from '@config/env';
import { petExtrasStorage } from '@storage/petExtrasStorage';
import { normalizeSpecies, speciesToApiLabel } from '@utils/species';
import { calculateAgeInYears } from '@utils/date';
import { Pet, PetApiDTO, PetFormData } from '@models/Pet';
import { PetRegistrationAiResponseDTO } from '@models/PetAiAnalysis';
interface PageResponse<T> {
  content: T[];
  totalElements: number;
}
async function toViewModel(dto: PetApiDTO): Promise<Pet> {
  const extras = await petExtrasStorage.getExtras(String(dto.id));
  return {
    id: String(dto.id),
    name: dto.nome,
    species: normalizeSpecies(dto.especie),
    breed: dto.raca ?? 'SRD',
    weight: dto.peso,
    age: dto.idade,
    score: dto.healthScore,
    tutorId: dto.tutorId,
    photoUri: extras.photoUri,
    sex: extras.sex ?? 'male',
    neutered: extras.neutered ?? false,
    microchip: extras.microchip,
    observations: extras.observations,
    birthDate: extras.birthDate,
    color: extras.color,
    size: extras.size,
    bodyCondition: extras.bodyCondition,
  };
}
function toRequestDTO(form: PetFormData) {
  const ageFromBirthDate = form.birthDate ? calculateAgeInYears(form.birthDate) : null;
  const idade = ageFromBirthDate ?? parseInt(form.age, 10);
  return {
    nome: form.name.trim(),
    especie: speciesToApiLabel(form.species),
    raca: form.breed.trim() || null,
    idade,
    peso: parseFloat(form.weight.replace(',', '.')),
  };
}
export const petService = {
  async listPets(): Promise<Pet[]> {
    try {
      const { data } = await api.get<PageResponse<PetApiDTO>>('/pets', {
        params: { size: 200 },
      });
      return Promise.all(data.content.map(toViewModel));
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível carregar seus pets.'));
    }
  },
  async getPet(id: string): Promise<Pet> {
    try {
      const { data } = await api.get<PetApiDTO>(`/pets/${id}`);
      return toViewModel(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível carregar o pet.'));
    }
  },
  async analisarCadastro(photoUri: string): Promise<PetRegistrationAiResponseDTO> {
    const formData = new FormData();
    const filename = photoUri.split('/').pop() || `pet_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    formData.append('imagem', {
      uri: photoUri,
      name: filename,
      type: mimeType,
    } as any);
    try {
      const { data } = await api.post<PetRegistrationAiResponseDTO>('/pets/analisar-cadastro', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: AI_ANALYSIS_TIMEOUT_MS,
      });
      return data;
    } catch (error) {
      throw new Error(
        extractApiErrorMessage(
          error,
          'Não foi possível analisar a foto. Verifique se o Java e o serviço de IA (Python) estão rodando.',
        ),
      );
    }
  },
  async createPet(form: PetFormData): Promise<Pet> {
    try {
      const dto = toRequestDTO(form);
      const { data } = await api.post<PetApiDTO>('/pets', dto);
      await petExtrasStorage.saveExtras(String(data.id), {
        photoUri: form.photoUri || undefined,
        sex: form.sex,
        neutered: form.neutered,
        microchip: form.microchip || undefined,
        observations: form.observations || undefined,
        birthDate: form.birthDate || undefined,
        color: form.color || undefined,
        size: form.size || undefined,
        bodyCondition: form.bodyCondition || undefined,
      });
      return toViewModel(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível cadastrar o pet.'));
    }
  },
  async updatePet(id: string, form: PetFormData): Promise<Pet> {
    try {
      const dto = toRequestDTO(form);
      const { data } = await api.put<PetApiDTO>(`/pets/${id}`, dto);
      await petExtrasStorage.saveExtras(id, {
        photoUri: form.photoUri || undefined,
        sex: form.sex,
        neutered: form.neutered,
        microchip: form.microchip || undefined,
        observations: form.observations || undefined,
        birthDate: form.birthDate || undefined,
        color: form.color || undefined,
        size: form.size || undefined,
        bodyCondition: form.bodyCondition || undefined,
      });
      return toViewModel(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível atualizar o pet.'));
    }
  },
  async deletePet(id: string): Promise<void> {
    try {
      await api.delete(`/pets/${id}`);
      await petExtrasStorage.deleteExtras(id);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Não foi possível remover o pet.'));
    }
  },
};
