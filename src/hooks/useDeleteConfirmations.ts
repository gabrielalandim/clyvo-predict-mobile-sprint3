import { Alert } from 'react-native';
import { useDeletePet } from './usePets';
import { useDeleteHealthEvent } from './useHealthEvents';

function alertUnlessAlreadyDeleted(error: Error) {
  if (error.message?.toLowerCase().includes('não encontrado')) return;
  Alert.alert('Erro', error.message);
}

export function useConfirmDeletePet() {
  const deletePet = useDeletePet();

  return (pet: { id: string; name?: string }, onDeleted?: () => void) => {
    const nome = pet.name ? `o(a) ${pet.name}` : 'este pet';
    Alert.alert(
      'Remover pet',
      `Tem certeza que deseja remover ${nome}? Todos os eventos de saúde serão apagados e essa ação não poderá ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            if (deletePet.isPending) return;
            deletePet.mutate(pet.id, { onSuccess: () => onDeleted?.(), onError: alertUnlessAlreadyDeleted });
          },
        },
      ],
    );
  };
}

export function useConfirmDeleteHealthEvent(petId: string) {
  const deleteEvent = useDeleteHealthEvent();

  return (eventId: string) => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que quer excluir esse evento? O score será recalculado.', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, excluir',
        style: 'destructive',
        onPress: () => {
          if (deleteEvent.isPending) return;
          deleteEvent.mutate({ id: eventId, petId }, { onError: alertUnlessAlreadyDeleted });
        },
      },
    ]);
  };
}
