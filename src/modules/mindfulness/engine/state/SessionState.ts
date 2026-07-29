/**
 * Estados de alto nivel del ciclo de vida de una sesion de mindfulness.
 */
export const SESSION_STATES = {
	IDLE: "IDLE",
	READY: "READY",
	RUNNING: "RUNNING",
	PAUSED: "PAUSED",
	ASSESSMENT: "ASSESSMENT",
	FINISHED: "FINISHED",
} as const;

export type SessionState = (typeof SESSION_STATES)[keyof typeof SESSION_STATES];