export type EmotionRegulationIntervention = {
	id: string;
	title: string;
	description: string;
};

export const emotionRegulationInterventions: EmotionRegulationIntervention[] = [
	{
		id: "identificacion-emocional",
		title: "Identificación Emocional",
		description: "Reconoce la emoción presente y su contexto para fortalecer la conciencia emocional.",
	},
	{
		id: "diferenciacion-emocional",
		title: "Diferenciación Emocional",
		description: "Distinge entre emociones similares para comprender mejor la experiencia interna.",
	},
	{
		id: "regulacion-fisiologica",
		title: "Regulación Fisiológica",
		description: "Aplica estrategias corporales para disminuir la intensidad de la respuesta emocional.",
	},
	{
		id: "reevaluacion-emocional",
		title: "Reevaluación Emocional",
		description: "Revisa la situación desde una perspectiva más flexible y ajustada a la realidad.",
	},
	{
		id: "plan-personal-regulacion",
		title: "Plan Personal de Regulación",
		description: "Sintetiza las estrategias más útiles para aplicar de forma autónoma ante futuras situaciones.",
	},
];
