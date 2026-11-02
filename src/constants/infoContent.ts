export type InfoTopic = 'help' | 'terms' | 'privacy';

export interface InfoSection {
  title: string;
  body: string;
}

export interface InfoPage {
  title: string;
  icon: 'help-circle-outline' | 'document-text-outline' | 'shield-checkmark-outline';
  intro: string;
  sections: InfoSection[];
}

export const INFO_PAGES: Record<InfoTopic, InfoPage> = {
  help: {
    title: 'Central de Ajuda',
    icon: 'help-circle-outline',
    intro: 'Respostas rápidas para as dúvidas mais comuns sobre o ClyvoPredict.',
    sections: [
      {
        title: 'Como o Score de Saúde é calculado?',
        body: 'Todo pet começa com 100 pontos. Cada evento registrado soma ou subtrai pontos: vacina +10, consulta e exame +5, relato de sintoma e mudança de comportamento −5, doença leve −15, cirurgia −30, doença grave −40 e acidente −50. O cálculo é feito pela API e o valor fica sempre entre 0 e 100.',
      },
      {
        title: 'Como cadastrar um pet pela foto?',
        body: 'Em "Adicionar Pet", escolha "Cadastrar pet com IA" e tire ou selecione uma foto. A IA sugere espécie, raça, cor, porte e faixa de peso. Você sempre revisa e confirma os dados antes de salvar.',
      },
      {
        title: 'Como edito ou excluo um evento?',
        body: 'Abra os detalhes do pet e mantenha o dedo pressionado sobre o evento no histórico. Vão aparecer as opções de editar e excluir; o score é recalculado automaticamente.',
      },
      {
        title: 'Quando recebo notificações?',
        body: 'O app avisa quando o score do pet muda de faixa (Excelente, Regular ou Crítico) depois de um evento, e também no horário dos lembretes de cuidados que você agendar. Você pode ligar ou desligar cada tipo em Perfil > Preferências.',
      },
      {
        title: 'Esqueci minha senha',
        body: 'Por enquanto a redefinição é feita pelo suporte da Clyvo. Se você estiver logado, pode trocar a senha em Perfil > Alterar Senha.',
      },
    ],
  },
  terms: {
    title: 'Termos de Uso',
    icon: 'document-text-outline',
    intro: 'Ao usar o ClyvoPredict você concorda com as condições abaixo.',
    sections: [
      {
        title: '1. Finalidade',
        body: 'O ClyvoPredict ajuda tutores a organizar o histórico de saúde dos pets e acompanhar um score preventivo. O app não substitui consulta, diagnóstico ou tratamento veterinário.',
      },
      {
        title: '2. Conta do tutor',
        body: 'Você é responsável pelas informações cadastradas e por manter sua senha em sigilo. O acesso é pessoal e protegido por token de autenticação.',
      },
      {
        title: '3. Sugestões da IA',
        body: 'As sugestões geradas a partir de fotos são estimativas e precisam ser confirmadas pelo tutor antes de salvar o cadastro.',
      },
      {
        title: '4. Projeto acadêmico',
        body: 'Esta versão foi desenvolvida no FIAP Challenge 2026 em parceria com a Clyvo e pode passar por mudanças sem aviso prévio.',
      },
    ],
  },
  privacy: {
    title: 'Privacidade (LGPD)',
    icon: 'shield-checkmark-outline',
    intro: 'Como tratamos seus dados, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).',
    sections: [
      {
        title: 'Quais dados coletamos',
        body: 'Nome, e-mail e telefone do tutor; dados dos pets (nome, espécie, raça, idade, peso) e os eventos de saúde que você registra.',
      },
      {
        title: 'Onde os dados ficam',
        body: 'Os dados de conta, pets e eventos ficam no servidor da API. No aparelho, o token de acesso é guardado no armazenamento criptografado do sistema (Keychain/Keystore). Fotos, anotações e lembretes ficam apenas no seu celular.',
      },
      {
        title: 'Para que usamos',
        body: 'Exclusivamente para calcular o score de saúde, montar o histórico e a carteirinha do pet e enviar as notificações que você ativou.',
      },
      {
        title: 'Seus direitos',
        body: 'Você pode consultar e corrigir seus dados em Perfil > Editar Perfil e encerrar a sessão a qualquer momento. Pets removidos têm todos os eventos apagados junto.',
      },
    ],
  },
};
