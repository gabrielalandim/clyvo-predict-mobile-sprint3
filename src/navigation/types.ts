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
      tipoEvento: import('@models/HealthEvent').TipoEvento;
      descricao: string;
      dataEvento: string;
    };
  };
  History: undefined;
  Carteirinha:
    | {
        petId?: string;
      }
    | undefined;
  tutorProfile: undefined;
};