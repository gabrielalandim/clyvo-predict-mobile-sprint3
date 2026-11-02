import { TipoEvento } from '@models/HealthEvent';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  PetDetails: {
    petId: string;
  };
  AddPetChoice: undefined;
  AddPet: {
    mode: 'manual' | 'photo' | 'edit';
    petId?: string;
  };
  AddHealthEvent: {
    petId: string;
    editEvent?: {
      id: string;
      tipoEvento: TipoEvento;
      descricao: string;
      dataEvento: string;
    };
  };
  PetHistory: { petId?: string } | undefined;
  PetWallet: { petId?: string } | undefined;
  TutorProfile: undefined;
  EditProfile: { mode: 'profile' | 'password' };
};