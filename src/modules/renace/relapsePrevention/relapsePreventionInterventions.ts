export interface RelapsePreventionIntervention {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const relapsePreventionInterventions: RelapsePreventionIntervention[] = [
  {
    id: 'risk-warning-signs',
    title: 'Identificación de Señales de Riesgo',
    description: 'Reconoce situaciones y señales tempranas que pueden aumentar el riesgo de recaída.',
    enabled: true,
  },
  {
    id: 'protective-factors',
    title: 'Factores Protectores',
    description: 'Identifica recursos personales, sociales y prácticos que favorecen tu bienestar.',
    enabled: true,
  },
  {
    id: 'coping-plan',
    title: 'Plan de Afrontamiento',
    description: 'Organiza acciones concretas para responder ante una situación de riesgo.',
    enabled: true,
  },
  {
    id: 'mental-rehearsal-risk-situation',
    title: 'Ensayo Mental de una Situación de Riesgo',
    description: 'Practica mentalmente cómo aplicar tu plan ante una situación de riesgo.',
    enabled: true,
  },
  {
    id: 'personal-relapse-prevention-plan',
    title: 'Plan Personal de Prevención de Recaídas',
    description: 'Integra tus señales, factores protectores y estrategias en un plan personal.',
    enabled: true,
  },
];
