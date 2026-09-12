import { Species } from '@constants/races';
export interface PetApiDTO {
  id: number;
  nome: string;
  especie: string;
  raca: string | null;
  idade: number;
  peso: number;
  healthScore: number;
  tutorId: number;
}
export interface PetLocalExtras {
  photoUri?: string;
  sex?: 'male' | 'female';
  neutered?: boolean;
  microchip?: string;
  observations?: string;
  birthDate?: string;
  color?: string;
  size?: string;
  bodyCondition?: string;
  origem?: 'MANUAL' | 'IA_VISUAL';
  iaConfianca?: number;
}
export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  weight: number;
  age: number;
  score: number;
  tutorId: number;
  photoUri?: string;
  sex: 'male' | 'female';
  neutered: boolean;
  microchip?: string;
  observations?: string;
  birthDate?: string;
  color?: string;
  size?: string;
  bodyCondition?: string;
}
export interface PetFormData {
  name: string;
  species: Species;
  breed: string;
  age: string;
  birthDate: string;
  weight: string;
  sex: 'male' | 'female';
  neutered: boolean;
  microchip: string;
  observations: string;
  photoUri: string;
  color: string;
  size: string;
  bodyCondition: string;
}
