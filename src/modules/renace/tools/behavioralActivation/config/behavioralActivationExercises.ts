export type BehavioralActivationExercise = {
	id: string;
	title: string;
	description: string;
};

export const behavioralActivationExercises: BehavioralActivationExercise[] = [
	{
		id: "agenda-actividades",
		title: "Agenda de Actividades",
		description: "Planifica actividades concretas por franjas del día para recuperar estructura, energía y contacto con reforzadores saludables.",
	},
	{
		id: "registro-placer-logro",
		title: "Registro Placer–Logro",
		description: "Registra cada actividad realizada y evalúa su impacto en placer y logro para identificar patrones que favorecen el bienestar.",
	},
	{
		id: "identificacion-evitacion",
		title: "Identificación de Evitación",
		description: "Identifica situaciones evitadas, obstáculos percibidos y alternativas posibles para debilitar patrones que sostienen el estado depresivo.",
	},
	{
		id: "jerarquia-actividades",
		title: "Jerarquía de Actividades",
		description: "Organiza actividades por prioridad, importancia, dificultad y probabilidad para avanzar desde acciones alcanzables hacia metas más exigentes.",
	},
	{
		id: "plan-semanal",
		title: "Plan Semanal",
		description: "Define compromisos concretos para la semana con día, momento, prioridad y confianza para fortalecer la activación conductual sostenida.",
	},
];
