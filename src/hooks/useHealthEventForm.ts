import { useState } from 'react';
import { HealthEvent, TipoEvento } from '@models/HealthEvent';
import { FormResult } from '@models/FormResult';
import { fromIsoDate, isValidDateInput, maskDateInput, toIsoDate } from '@utils/dateInput';
import { useCreateHealthEvent, useUpdateHealthEvent } from './useHealthEvents';

export interface EditableHealthEvent {
  id: string;
  tipoEvento: TipoEvento;
  descricao: string;
  dataEvento: string;
}

export function useHealthEventForm(petId: string, editEvent?: EditableHealthEvent) {
  const createEvent = useCreateHealthEvent();
  const updateEvent = useUpdateHealthEvent();
  const [descricao, setDescricao] = useState(editEvent?.descricao ?? '');
  const [tipo, setTipo] = useState<TipoEvento>(editEvent?.tipoEvento ?? 'VACINA');
  const [dataTexto, setDataTextoRaw] = useState(editEvent ? fromIsoDate(editEvent.dataEvento) : '');

  const setDataTexto = (text: string) => setDataTextoRaw(maskDateInput(text));

  const submit = async (): Promise<FormResult<HealthEvent>> => {
    if (!descricao.trim() || !isValidDateInput(dataTexto)) {
      return { ok: false, title: 'Erro', message: 'Preencha a descrição e uma data válida (dd/mm/aaaa).' };
    }
    const payload = { petId, tipoEvento: tipo, descricao: descricao.trim(), dataEvento: toIsoDate(dataTexto) };
    try {
      if (editEvent) {
        const event = await updateEvent.mutateAsync({ id: editEvent.id, ...payload });
        return { ok: true, data: event, message: 'Evento atualizado e score recalculado.' };
      }
      const event = await createEvent.mutateAsync(payload);
      return { ok: true, data: event, message: 'Evento salvo e o score do pet foi atualizado.' };
    } catch (error) {
      return { ok: false, title: 'Erro', message: (error as Error).message };
    }
  };

  return {
    isEditing: !!editEvent,
    descricao,
    setDescricao,
    tipo,
    setTipo,
    dataTexto,
    setDataTexto,
    isSaving: createEvent.isPending || updateEvent.isPending,
    submit,
  };
}
