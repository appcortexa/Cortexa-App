/**
 * Tipos de eventos que pueden aparecer en una timeline de mindfulness.
 */
export const TimelineEventType = {
	START: "START",
	SHOW_PROMPT: "SHOW_PROMPT",
	ASSESSMENT: "ASSESSMENT",
	END: "END",
} as const;

export type TimelineEventType =
	(typeof TimelineEventType)[keyof typeof TimelineEventType];

/**
 * Evento planificado sobre la linea de tiempo de una sesion.
 *
 * Ejemplo esperado:
 * START -> SHOW_PROMPT -> SHOW_PROMPT -> ASSESSMENT -> END.
 */
export interface TimelineEvent {
	id: string;
	timestampMs: number;
	type: TimelineEventType;
	payload?: unknown;
}