export type AntiRuminationIntervention = {
	id: string;
	title: string;
	description: string;
};

export const antiRuminationInterventions: AntiRuminationIntervention[] = [
	{
		id: "deteccion-rumiacion",
		title: "Detección de Rumiación",
		description: "Identificar cuando aparece un ciclo repetitivo de pensamientos.",
	},
	{
		id: "romper-ciclo",
		title: "Romper el Ciclo",
		description: "Practicar estrategias para interrumpir la rumiacion.",
	},
	{
		id: "cambio-atencion",
		title: "Cambio de Atencion",
		description: "Entrenar el redireccionamiento voluntario de la atencion.",
	},
	{
		id: "accion-con-sentido",
		title: "Accion con Sentido",
		description: "Realizar acciones valiosas aun cuando la rumiacion este presente.",
	},
	{
		id: "aprendizajes",
		title: "Plan Personal Antirrumiación",
		description: "Construir un plan personal breve para responder de forma diferente cuando reaparezca la rumiación.",
	},
];