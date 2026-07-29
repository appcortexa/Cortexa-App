export type CognitiveRestructuringIntervention = {
	id: string;
	title: string;
	description: string;
};

export const cognitiveRestructuringInterventions: CognitiveRestructuringIntervention[] = [
	{
		id: "deteccion-pensamientos-automaticos",
		title: "Deteccion de Pensamientos Automaticos",
		description: "Identifica pensamientos automaticos vinculados a situaciones concretas para aumentar conciencia cognitiva.",
	},
	{
		id: "analisis-evidencias",
		title: "Analisis de Evidencias",
		description: "Examina evidencias a favor y en contra para cuestionar interpretaciones poco utiles.",
	},
	{
		id: "pensamientos-alternativos",
		title: "Pensamientos Alternativos",
		description: "Formula alternativas mas equilibradas y realistas frente al pensamiento inicial.",
	},
	{
		id: "reencuadre-cognitivo",
		title: "Reencuadre Cognitivo",
		description: "Reinterpreta la situacion desde una perspectiva funcional orientada a accion.",
	},
	{
		id: "tarjeta-afrontamiento",
		title: "Tarjeta de Afrontamiento",
		description: "Sintetiza recordatorios clave para responder mejor ante momentos de activacion emocional.",
	},
];
