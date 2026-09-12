import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Pet } from '@models/Pet';
import { HealthEvent, getEventTypeConfig } from '@models/HealthEvent';

function formatDate(dataEvento: string): string {
  return new Date(`${dataEvento}T00:00:00`).toLocaleDateString('pt-BR');
}

function eventRowsHtml(events: HealthEvent[], emptyLabel: string): string {
  if (events.length === 0) {
    return `<p class="empty">${emptyLabel}</p>`;
  }
  return events
    .map(
      (evt) => `
        <tr>
          <td>${getEventTypeConfig(evt.tipoEvento).emoji} ${evt.descricao}</td>
          <td>${formatDate(evt.dataEvento)}</td>
        </tr>`,
    )
    .join('');
}

function buildHtml(pet: Pet, events: HealthEvent[]): string {
  const vacinas = events.filter((e) => e.tipoEvento === 'VACINA');
  const exames = events.filter((e) => e.tipoEvento === 'EXAME');
  const consultas = events.filter((e) => e.tipoEvento === 'CONSULTA_ROTINA');
  const outros = events.filter((e) => !['VACINA', 'EXAME', 'CONSULTA_ROTINA'].includes(e.tipoEvento));
  const geradoEm = new Date().toLocaleString('pt-BR');

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1E2761; padding: 24px; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        .subtitle { color: #6b6b6b; font-size: 13px; margin-bottom: 24px; }
        .card { border: 1px solid #E0E0E0; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .pet-header { display: flex; justify-content: space-between; align-items: center; }
        .pet-name { font-size: 20px; font-weight: 700; }
        .pet-meta { font-size: 13px; color: #444; margin-top: 4px; }
        .score { font-size: 28px; font-weight: 800; color: #289fce; }
        h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #444; margin: 24px 0 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        td { padding: 6px 4px; border-bottom: 1px solid #f0f0f0; }
        td:last-child { text-align: right; color: #666; white-space: nowrap; }
        .empty { font-size: 13px; color: #999; font-style: italic; }
        .footer { margin-top: 32px; font-size: 11px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <h1>Carteirinha Digital — ClyvoPredict</h1>
      <div class="subtitle">Gerado em ${geradoEm}</div>

      <div class="card pet-header">
        <div>
          <div class="pet-name">${pet.name}</div>
          <div class="pet-meta">${pet.breed || 'SRD'} • ${pet.age} ${pet.age === 1 ? 'ano' : 'anos'} • ${pet.weight ?? '--'} kg</div>
        </div>
        <div class="score">${pet.score}</div>
      </div>

      <h2>Vacinas</h2>
      <table><tbody>${eventRowsHtml(vacinas, 'Nenhuma vacina registrada.')}</tbody></table>

      <h2>Exames</h2>
      <table><tbody>${eventRowsHtml(exames, 'Nenhum exame registrado.')}</tbody></table>

      <h2>Consultas</h2>
      <table><tbody>${eventRowsHtml(consultas, 'Nenhuma consulta registrada.')}</tbody></table>

      <h2>Outros registros</h2>
      <table><tbody>${eventRowsHtml(outros, 'Nenhum outro registro.')}</tbody></table>

      <div class="footer">Documento gerado automaticamente pelo app ClyvoPredict a partir dos dados cadastrados.</div>
    </body>
  </html>`;
}

export async function generateAndSharePetPdf(pet: Pet, events: HealthEvent[]): Promise<void> {
  const html = buildHtml(pet, events);
  const { uri } = await Print.printToFileAsync({ html });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Carteirinha de ${pet.name}`,
      UTI: 'com.adobe.pdf',
    });
  }
}