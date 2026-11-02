import { useEffect, useState } from 'react';
import { RACES_BY_SPECIES, Species } from '@constants/races';
import { Pet, PetFormData } from '@models/Pet';
import { FormResult } from '@models/FormResult';
import { normalizeSpecies } from '@utils/species';
import { isValidDateInput, maskDateInput } from '@utils/dateInput';
import { usePet, useCreatePet, useUpdatePet, useAnalisarCadastro } from './usePets';

export type PetFormMode = 'manual' | 'photo' | 'edit';

export interface PetFormErrors {
  name?: boolean;
  breed?: boolean;
  age?: boolean;
  weight?: boolean;
}

const MAX_WEIGHT_KG = 150;

export const EMPTY_PET_FORM: PetFormData = {
  name: '',
  species: 'dog',
  breed: '',
  age: '',
  birthDate: '',
  weight: '',
  sex: 'male',
  neutered: false,
  microchip: '',
  observations: '',
  photoUri: '',
  color: '',
  size: '',
  bodyCondition: '',
};

function petToForm(pet: Pet): PetFormData {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: String(pet.age),
    birthDate: pet.birthDate ?? '',
    weight: String(pet.weight),
    sex: pet.sex,
    neutered: pet.neutered,
    microchip: pet.microchip ?? '',
    observations: pet.observations ?? '',
    photoUri: pet.photoUri ?? '',
    color: pet.color ?? '',
    size: pet.size ?? '',
    bodyCondition: pet.bodyCondition ?? '',
  };
}

function validate(form: PetFormData): PetFormErrors {
  const errors: PetFormErrors = {};
  if (!form.name.trim()) errors.name = true;
  if (!form.breed.trim()) errors.breed = true;
  if (!form.birthDate && (!form.age || parseInt(form.age, 10) < 0)) errors.age = true;
  if (form.birthDate && !isValidDateInput(form.birthDate)) errors.age = true;
  if (!form.weight || isNaN(parseFloat(form.weight.replace(',', '.')))) errors.weight = true;
  return errors;
}

const BREED_PLACEHOLDERS: Record<Species, string> = {
  dog: 'Selecione a raça (Ex: Golden Retriever)',
  cat: 'Selecione a raça (Ex: Persa)',
  other: 'Selecione a raça (Ex: Calopsita)',
};

export function usePetForm(mode: PetFormMode, petId?: string) {
  const editingPetId = mode === 'edit' ? petId : undefined;
  const { data: editingPet, isLoading: loadingPet, error: loadError } = usePet(editingPetId);
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const analisarCadastro = useAnalisarCadastro();

  const [formData, setFormData] = useState<PetFormData>(EMPTY_PET_FORM);
  const [errors, setErrors] = useState<PetFormErrors>({});
  const [isCustomBreed, setIsCustomBreed] = useState(false);
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [estimatedWeight, setEstimatedWeight] = useState<{ min: number; max: number } | null>(null);

  useEffect(() => {
    if (!editingPet) return;
    setFormData(petToForm(editingPet));
    const knownBreeds = RACES_BY_SPECIES[editingPet.species] ?? [];
    if (!knownBreeds.includes(editingPet.breed)) setIsCustomBreed(true);
  }, [editingPet]);

  const updateField = <K extends keyof PetFormData>(field: K, value: PetFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const setName = (text: string) => updateField('name', text);
  const setAge = (text: string) => updateField('age', text.replace(/\D/g, ''));
  const setBirthDate = (text: string) => updateField('birthDate', maskDateInput(text));
  const setMicrochip = (text: string) => updateField('microchip', text.replace(/\D/g, ''));

  const setWeight = (text: string) => {
    const cleaned = text.replace(',', '.');
    if (!/^\d*\.?\d*$/.test(cleaned)) return;
    const num = parseFloat(cleaned);
    updateField('weight', !isNaN(num) && num > MAX_WEIGHT_KG ? String(MAX_WEIGHT_KG) : cleaned);
  };

  const selectSpecies = (species: Species) => {
    setFormData((prev) => ({ ...prev, species, breed: '' }));
    setErrors((prev) => ({ ...prev, breed: false }));
    setShowBreedDropdown(false);
  };

  const selectBreed = (breed: string) => {
    updateField('breed', breed);
    setShowBreedDropdown(false);
  };

  const setCustomBreed = (text: string) => updateField('breed', text);

  const toggleCustomBreed = () => {
    setIsCustomBreed((prev) => !prev);
    updateField('breed', '');
    setShowBreedDropdown(false);
  };

  const toggleBreedDropdown = () => setShowBreedDropdown((prev) => !prev);

  const analyzePhoto = async (uri: string): Promise<FormResult> => {
    try {
      const resposta = await analisarCadastro.mutateAsync(uri);
      const analise = resposta.analise_cadastro;
      if (!analise) {
        return {
          ok: false,
          title: 'IA não identificou o pet',
          message:
            resposta.aviso ||
            'Não conseguimos identificar as características a partir dessa foto. Preencha manualmente.',
        };
      }
      const species = normalizeSpecies(analise.especie);
      const knownBreeds = RACES_BY_SPECIES[species] ?? [];
      const breedMatch = knownBreeds.find((b) => b.toLowerCase() === (analise.raca_estimada ?? '').toLowerCase());
      setFormData((prev) => ({
        ...prev,
        species,
        breed: breedMatch ?? analise.raca_estimada ?? prev.breed,
        color: analise.cor_predominante ?? prev.color,
        size: analise.porte_estimado ?? prev.size,
        bodyCondition: analise.condicao_corporal ?? prev.bodyCondition,
      }));
      if (!breedMatch && analise.raca_estimada) setIsCustomBreed(true);
      setEstimatedWeight(analise.faixa_peso_estimada_kg ?? null);
      setAiConfidence(typeof analise.confianca === 'number' ? analise.confianca : null);
      setAiApplied(true);
      return { ok: true, data: undefined };
    } catch (error) {
      return { ok: false, title: 'Erro ao analisar foto', message: (error as Error).message };
    }
  };

  const setPhoto = async (uri: string): Promise<FormResult | null> => {
    updateField('photoUri', uri);
    return mode === 'photo' ? analyzePhoto(uri) : null;
  };

  const submit = async (): Promise<FormResult<Pet>> => {
    const newErrors = validate(formData);
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return {
        ok: false,
        title: 'Erro',
        message:
          newErrors.age && formData.birthDate
            ? 'A data de nascimento informada não é válida (dd/mm/aaaa).'
            : 'Por favor, preencha corretamente os campos obrigatórios marcados em vermelho.',
      };
    }
    try {
      if (mode === 'edit' && petId) {
        const pet = await updatePet.mutateAsync({ id: petId, form: formData });
        return { ok: true, data: pet, message: `${pet.name} foi atualizado!` };
      }
      const pet = await createPet.mutateAsync(formData);
      return { ok: true, data: pet, message: `${pet.name} foi cadastrado!` };
    } catch (error) {
      return {
        ok: false,
        title: mode === 'edit' ? 'Erro ao atualizar' : 'Erro ao cadastrar',
        message: (error as Error).message,
      };
    }
  };

  return {
    formData,
    errors,
    loadingPet,
    loadError,
    submitting: createPet.isPending || updatePet.isPending,
    analyzing: analisarCadastro.isPending,
    isCustomBreed,
    showBreedDropdown,
    aiApplied,
    aiConfidence,
    estimatedWeight,
    breedPlaceholder: BREED_PLACEHOLDERS[formData.species],
    updateField,
    setName,
    setAge,
    setBirthDate,
    setWeight,
    setMicrochip,
    setCustomBreed,
    selectSpecies,
    selectBreed,
    toggleCustomBreed,
    toggleBreedDropdown,
    setPhoto,
    submit,
  };
}
