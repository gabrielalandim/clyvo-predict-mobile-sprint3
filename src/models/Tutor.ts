export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export interface TutorUpdatePayload {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}
