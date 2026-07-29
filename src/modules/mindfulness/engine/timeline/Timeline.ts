import type { TimelineEvent } from "./TimelineEvent";

/**
 * Plano completo y puro de una sesion de mindfulness.
 */
export interface Timeline {
	timelineEvents: TimelineEvent[];
	durationMs: number;
}