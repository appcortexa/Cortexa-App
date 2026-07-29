import type {
	AssessmentFrequency,
	AssessmentVariable,
	PracticeType,
	SessionMode,
} from "./mindfulness.models";

/**
 * Contrato de configuracion que viajara entre la pantalla de configuracion,
 * el futuro SessionEngine, el Scheduler y la persistencia.
 *
 * La estructura podra ampliarse en versiones futuras con campos como
 * patientId, therapistId, sessionNotes, difficulty o metadata sin romper
 * compatibilidad con los consumidores actuales.
 */
export interface MindfulnessSessionConfig {
	expediente: string;
	practice: PracticeType;
	durationMinutes: number;
	assessmentFrequency: AssessmentFrequency;
	enabledVariables: AssessmentVariable[];
	sessionMode: SessionMode;
}
