/**
 * Acciones del flujo de sesion. No requieren payload en esta etapa.
 */
export const SESSION_ACTION_TYPES = {
	INITIALIZE: "INITIALIZE",
	START: "START",
	PAUSE: "PAUSE",
	RESUME: "RESUME",
	SHOW_ASSESSMENT: "SHOW_ASSESSMENT",
	CONTINUE: "CONTINUE",
	FINISH: "FINISH",
	RESET: "RESET",
} as const;

export type SessionAction =
	| { type: typeof SESSION_ACTION_TYPES.INITIALIZE }
	| { type: typeof SESSION_ACTION_TYPES.START }
	| { type: typeof SESSION_ACTION_TYPES.PAUSE }
	| { type: typeof SESSION_ACTION_TYPES.RESUME }
	| { type: typeof SESSION_ACTION_TYPES.SHOW_ASSESSMENT }
	| { type: typeof SESSION_ACTION_TYPES.CONTINUE }
	| { type: typeof SESSION_ACTION_TYPES.FINISH }
	| { type: typeof SESSION_ACTION_TYPES.RESET };