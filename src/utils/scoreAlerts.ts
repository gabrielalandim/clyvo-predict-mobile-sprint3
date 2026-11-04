import { getScoreBand, ScoreBand } from './score';

export interface ScoreAlert {
  title: string;
  body: string;
}

const BAND_ORDER: Record<ScoreBand, number> = { critico: 0, regular: 1, excelente: 2 };

export function buildScoreAlert(petName: string, previousScore: number, newScore: number): ScoreAlert | null {
  if (previousScore === newScore) return null;
  const before = getScoreBand(previousScore);
  const after = getScoreBand(newScore);
  const change = `de ${previousScore} para ${newScore}`;

  if (before === after) {
    if (after === 'critico' && newScore < previousScore) {
      return {
        title: `🚨 ${petName} continua na faixa crítica`,
        body: `O Score de Saúde caiu ${change}. Toque para ver o histórico e procurar um veterinário.`,
      };
    }
    return null;
  }

  const worsened = BAND_ORDER[after] < BAND_ORDER[before];
  if (worsened && after === 'critico') {
    return {
      title: `🚨 Score de ${petName} está crítico`,
      body: `O Score de Saúde caiu ${change}. Toque para ver o histórico e agendar um cuidado.`,
    };
  }
  if (worsened) {
    return {
      title: `⚠️ Atenção com ${petName}`,
      body: `O Score de Saúde caiu ${change} e saiu da faixa Excelente. Toque para ver os detalhes.`,
    };
  }
  if (after === 'excelente') {
    return {
      title: `🎉 ${petName} voltou para Excelente`,
      body: `O Score de Saúde subiu ${change}. Continue com os cuidados preventivos!`,
    };
  }
  return {
    title: `📈 ${petName} saiu da faixa crítica`,
    body: `O Score de Saúde subiu ${change}. Toque para acompanhar a evolução.`,
  };
}
