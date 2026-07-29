import type {
	ClinicalTimeline,
	ClinicalTimelineEvent,
} from "../../mindfulness/engine/clinical/IScheduler";

export const BREATHING_TIMELINE_EVENT_TYPES = {
	START: "START",
	BREATHING_CYCLE: "BREATHING_CYCLE",
	INTERMEDIATE_ASSESSMENT: "INTERMEDIATE_ASSESSMENT",
	END: "END",
} as const;

export type BreathingTimelineEventType =
	(typeof BREATHING_TIMELINE_EVENT_TYPES)[keyof typeof BREATHING_TIMELINE_EVENT_TYPES];

export interface BreathingTimelinePhasePlan {
	readonly id: string;
	readonly key: string;
	readonly label: string;
	readonly durationSeconds: number;
}

export interface BreathingTimelineStartPayload {
	readonly sessionMode: string;
	readonly patternId: string;
	readonly patternName: string;
}

export interface BreathingTimelineCyclePayload {
	readonly cycleNumber: number;
	readonly cycleDurationSeconds: number;
	readonly phases: readonly BreathingTimelinePhasePlan[];
}

export interface BreathingTimelineAssessmentPayload {
	readonly sequence: number;
}

export interface BreathingTimelineEndPayload {
	readonly totalCycles: number;
}

export type BreathingTimelinePayload =
	| BreathingTimelineStartPayload
	| BreathingTimelineCyclePayload
	| BreathingTimelineAssessmentPayload
	| BreathingTimelineEndPayload;

export interface BreathingTimelineEvent
	extends ClinicalTimelineEvent<BreathingTimelinePayload> {
	readonly type: BreathingTimelineEventType;
}

export interface BreathingSessionTimeline extends ClinicalTimeline<BreathingTimelineEvent> {
	readonly sessionId: string;
	readonly patternId: string;
	readonly cycleDurationSeconds: number;
	readonly totalCycles: number;
}

export interface BreathingIntermediateAssessmentsConfig {
	readonly checkpointRatios: readonly number[];
}
