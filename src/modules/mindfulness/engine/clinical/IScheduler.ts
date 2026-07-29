/**
 * Generic event model consumed by the clinical coordinator.
 */
export interface ClinicalTimelineEvent<TPayload = unknown> {
	readonly id: string;
	readonly type: string;
	readonly timestampMs: number;
	readonly payload?: TPayload;
}

/**
 * Immutable timeline generated for a session.
 */
export interface ClinicalTimeline<TEvent extends ClinicalTimelineEvent = ClinicalTimelineEvent> {
	readonly timelineEvents: readonly TEvent[];
	readonly durationMs: number;
}

/**
 * Produces a timeline from a session configuration and prompt sequence.
 */
export interface IScheduler<
	TConfig,
	TPrompt,
	TTimeline extends ClinicalTimeline = ClinicalTimeline,
> {
	generateTimeline(config: TConfig, promptSequence: readonly TPrompt[]): TTimeline;
}
