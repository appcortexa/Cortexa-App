export interface MindfulnessIntervention {
  id: string;
  title: string;
  description: string;
}

export const mindfulnessInterventions: MindfulnessIntervention[] = [
  {
    id: 'breathing-attention',
    title: 'Atención a la Respiración',
    description: 'Practica dirigir la atención al ritmo natural de la respiración.',
  },
  {
    id: 'non-judgmental-observation',
    title: 'Observación sin Juicio',
    description: 'Observa pensamientos, emociones y sensaciones sin evaluarlos.',
  },
  {
    id: 'body-scan',
    title: 'Escaneo Corporal',
    description: 'Recorre las sensaciones del cuerpo con atención y curiosidad.',
  },
  {
    id: 'present-moment-acceptance',
    title: 'Aceptación del Momento Presente',
    description: 'Practica reconocer la experiencia actual con apertura y aceptación.',
  },
  {
    id: 'personal-mindfulness-plan',
    title: 'Plan Personal de Mindfulness',
    description: 'Define prácticas personales para incorporar mindfulness en tu vida diaria.',
  },
];
