import { useState } from 'react';
import { CareReminderType } from '@models/CareReminder';
import { FormResult } from '@models/FormResult';
import { isValidDateInput, isValidTimeInput, maskDateInput, maskTimeInput, toDateTime } from '@utils/dateInput';
import { formatReminderDate } from '@utils/date';
import { useScheduleCareReminder } from './useCareReminders';

function todayBR(): string {
  return new Date().toLocaleDateString('pt-BR');
}

export function useReminderForm(petId: string, petName: string) {
  const scheduleReminder = useScheduleCareReminder();
  const [type, setType] = useState<CareReminderType>('CONSULTA');
  const [dateText, setDateTextRaw] = useState(todayBR());
  const [timeText, setTimeTextRaw] = useState('');

  const setDateText = (text: string) => setDateTextRaw(maskDateInput(text));
  const setTimeText = (text: string) => setTimeTextRaw(maskTimeInput(text));

  const isComplete = isValidDateInput(dateText) && isValidTimeInput(timeText);
  const preview = isComplete ? formatReminderDate(toDateTime(dateText, timeText)) : null;

  const submit = async (): Promise<FormResult<string>> => {
    if (!isComplete) {
      return { ok: false, title: 'Confira a data', message: 'Informe a data (dd/mm/aaaa) e o horário (hh:mm).' };
    }
    try {
      const date = toDateTime(dateText, timeText);
      const id = await scheduleReminder.mutateAsync({ petId, petName, type, date });
      return { ok: true, data: id, message: `Vamos te avisar: ${formatReminderDate(date)}.` };
    } catch (error) {
      return { ok: false, title: 'Não foi possível agendar', message: (error as Error).message };
    }
  };

  return {
    type,
    setType,
    dateText,
    setDateText,
    timeText,
    setTimeText,
    preview,
    saving: scheduleReminder.isPending,
    submit,
  };
}
