import type { MindfulnessSession } from "../models/mindfulness.models";

export interface UseMindfulnessSessionApi {
	session: MindfulnessSession | null;
	startSession: () => void;
	pauseSession: () => void;
	resumeSession: () => void;
	finishSession: () => void;
}

/**
 * Hook base del modulo Mindfulness.
 * TODO: conectar motores, estado y flujo de evaluaciones.
 */
export function useMindfulnessSession(): UseMindfulnessSessionApi {
	throw new Error("useMindfulnessSession no esta implementado todavia.");
}
