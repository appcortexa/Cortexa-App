import type { MindfulnessSession } from "../models/mindfulness.models";

/**
 * Orquesta el ciclo de vida operativo de una sesion de mindfulness.
 * Implementacion pendiente.
 */
export interface ISessionEngine {
	initialize(session: MindfulnessSession): void;
	start(): void;
	pause(): void;
	resume(): void;
	finish(): void;
	dispose(): void;
}
