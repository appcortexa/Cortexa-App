import type { MindfulnessSession } from "../models/mindfulness.models";

/**
 * Interfaz publica del servicio de Mindfulness.
 * La persistencia se define en una etapa posterior.
 */
export interface IMindfulnessService {
	createSessionDraft(patientId: string): MindfulnessSession;
	validateSession(session: MindfulnessSession): boolean;
}