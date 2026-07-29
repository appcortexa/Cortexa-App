/**
 * Tipos de practica disponibles para sesiones de mindfulness.
 */
export const PRACTICE_TYPES = {
	BREATH: "BREATH",
	BODY_SCAN: "BODY_SCAN",
	THOUGHTS: "THOUGHTS",
	EMOTIONS: "EMOTIONS",
	CRAVING: "CRAVING",
	SENSES: "SENSES",
} as const;

export type PracticeType = (typeof PRACTICE_TYPES)[keyof typeof PRACTICE_TYPES];

/**
 * Variables que pueden evaluarse durante una sesion.
 */
export const ASSESSMENT_VARIABLES = {
	CRAVING: "CRAVING",
	ANXIETY: "ANXIETY",
	EMOTIONAL_TENSION: "EMOTIONAL_TENSION",
} as const;

export type AssessmentVariable =
	(typeof ASSESSMENT_VARIABLES)[keyof typeof ASSESSMENT_VARIABLES];

export const ASSESSMENT_VARIABLE_LABELS: Record<AssessmentVariable, string> = {
	[ASSESSMENT_VARIABLES.CRAVING]: "Craving",
	[ASSESSMENT_VARIABLES.ANXIETY]: "Ansiedad",
	[ASSESSMENT_VARIABLES.EMOTIONAL_TENSION]: "Tensión emocional",
};

export const ASSESSMENT_VARIABLE_QUESTIONS: Record<AssessmentVariable, string> = {
	[ASSESSMENT_VARIABLES.CRAVING]: "¿Qué intensidad tiene ahora el deseo de consumir?",
	[ASSESSMENT_VARIABLES.ANXIETY]: "¿Qué nivel de ansiedad percibes en este momento?",
	[ASSESSMENT_VARIABLES.EMOTIONAL_TENSION]: "¿Qué nivel de tensión emocional sientes ahora mismo?",
};

/**
 * Frecuencias de evaluacion intermedia sobre el porcentaje de avance.
 */
export const ASSESSMENT_FREQUENCIES = {
	NONE: "NONE",
	PERCENT_25: "PERCENT_25",
	PERCENT_33: "PERCENT_33",
	PERCENT_50: "PERCENT_50",
} as const;

export type AssessmentFrequency =
	(typeof ASSESSMENT_FREQUENCIES)[keyof typeof ASSESSMENT_FREQUENCIES];

/** Modo en que el terapeuta avanza las tarjetas de la práctica. */
export const SESSION_MODES = {
	AUTOMATIC: "AUTOMATIC",
	MANUAL: "MANUAL",
} as const;

export type SessionMode = (typeof SESSION_MODES)[keyof typeof SESSION_MODES];

/**
 * Eventos de ciclo de vida de una sesion.
 */
export const SESSION_EVENT_TYPES = {
	START: "START",
	PROMPT: "PROMPT",
	ASSESSMENT: "ASSESSMENT",
	PAUSE: "PAUSE",
	RESUME: "RESUME",
	END: "END",
} as const;

export type SessionEventType =
	(typeof SESSION_EVENT_TYPES)[keyof typeof SESSION_EVENT_TYPES];

/**
 * Evento inmutable de sesion para trazabilidad.
 */
export interface SessionEvent {
	id: string;
	timestamp: string;
	type: SessionEventType;
	payload?: unknown;
}

/**
 * Registro de evaluacion sobre escala 0-10.
 */
export interface AssessmentRecord {
	variable: AssessmentVariable;
	value: number;
	timestamp: string;
}

/**
 * Contrato de datos de una sesion de mindfulness.
 */
export interface MindfulnessSession {
	id: string;
	patientId: string;
	practice: PracticeType;
	durationMinutes: number;
	assessmentFrequency: AssessmentFrequency;
	enabledVariables: AssessmentVariable[];
	startTime: string | null;
	endTime: string | null;
	events: SessionEvent[];
	initialAssessment: AssessmentRecord[];
	intermediateAssessments: AssessmentRecord[];
	finalAssessment: AssessmentRecord[];
}
