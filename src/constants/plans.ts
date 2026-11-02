export type PlanId = 'basic' | 'plus' | 'premium';

export interface Plan {
  id: PlanId;
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  color: string;
  features: string[];
}

export interface PricedPlan extends Omit<Plan, 'monthlyPrice' | 'annualPrice'> {
  price: string;
}

export type BillingCycle = 'monthly' | 'annual';

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 'Gratuito',
    annualPrice: 'Gratuito',
    description: 'Essencial para começar a cuidar do seu melhor amigo com segurança.',
    color: '#7F8C8D',
    features: [
      'Monitoramento de até 1 Pet',
      'Histórico de saúde básico',
      'Breakdown simplificado do Score',
      'Lembretes de consultas padrão',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    monthlyPrice: 'R$ 9,90/mês',
    annualPrice: 'R$ 89,90/ano',
    description: 'Mais controle, relatórios detalhados e alertas inteligentes para seu pet.',
    color: '#289fce',
    features: [
      'Monitoramento de até 3 Pets',
      'Histórico completo sem restrições',
      'Breakdown detalhado do Score',
      'Alertas automatizados via WhatsApp',
      'Gráficos de evolução de 6 meses',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 'R$ 19,90/mês',
    annualPrice: 'R$ 179,90/ano',
    description: 'Experiência completa com suporte prioritário e predições avançadas com IA.',
    color: '#126ca8',
    features: [
      'Pets Ilimitados',
      'Análise preditiva de saúde CLYVO Predict',
      'Suporte prioritário 24/7 com especialistas',
      'Exportação de relatórios em PDF para veterinários',
      'Alertas instantâneos e customizados',
    ],
  },
];

export function priceFor(plan: Plan, cycle: BillingCycle): PricedPlan {
  const { monthlyPrice, annualPrice, ...rest } = plan;
  return { ...rest, price: cycle === 'monthly' ? monthlyPrice : annualPrice };
}

export const getPlan = (id: PlanId): Plan => PLANS.find((p) => p.id === id) ?? PLANS[0];
