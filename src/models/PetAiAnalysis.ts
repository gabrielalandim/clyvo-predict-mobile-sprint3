export interface FaixaPesoDTO {
  min: number;
  max: number;
}
export interface PetRegistrationAnalysisDTO {
  especie: string;
  raca_estimada: string;
  cor_predominante: string;
  porte_estimado: string;
  faixa_peso_estimada_kg: FaixaPesoDTO;
  condicao_corporal: string;
  caracteristicas_visuais: string[];
  confianca: number;
}
export interface PetRegistrationAiResponseDTO {
  origem: string;
  requer_confirmacao: boolean;
  analise_cadastro: PetRegistrationAnalysisDTO | null;
  aviso?: string | null;
}
