export type Perfil = 'TUTOR' | 'VETERINARIO';

export interface TutorAuthResponseDTO {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  token: string;
  crmv?: string;
}
export interface TutorSession {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  token: string;
  crmv?: string;
}

export const isVeterinarian = (session: Pick<TutorSession, 'perfil'> | null | undefined): boolean =>
  session?.perfil === 'VETERINARIO';
