export interface SelfCompassionIntervention {
  id: string;
  title: string;
  description: string;
}

export const selfCompassionInterventions: SelfCompassionIntervention[] = [
  {
    id: 'self-critical-dialogue-detection',
    title: 'Detección del diálogo autocrítico',
    description: 'Identifica los pensamientos con los que te hablas de forma crítica.',
  },
  {
    id: 'responding-with-kindness',
    title: 'Responderse con amabilidad',
    description: 'Practica responder a las dificultades personales con comprensión y amabilidad.',
  },
  {
    id: 'common-humanity',
    title: 'Humanidad compartida',
    description: 'Reconoce que las dificultades y los errores forman parte de la experiencia humana.',
  },
  {
    id: 'compassionate-letter-to-self',
    title: 'Carta compasiva hacia uno mismo',
    description: 'Escribe un mensaje de apoyo dirigido a ti mismo ante una situación difícil.',
  },
  {
    id: 'personal-self-compassion-plan',
    title: 'Plan Personal de Autocompasión',
    description: 'Define acciones personales para responder con mayor amabilidad en momentos difíciles.',
  },
];
