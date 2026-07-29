/**
 * SessionTimeline is the complete precomputed plan of a session.
 *
 * SessionEngine must consume this structure as-is and execute events
 * without performing planning calculations during the live session.
 */

interface SessionTimelineEventBase {
	second: number;
	metadata?: Record<string, unknown>;
}

export const SESSION_TIMELINE_EVENT_TYPES = {
	CARD: "CARD",
	ASSESSMENT: "ASSESSMENT",
	FINISH: "FINISH",
} as const;

export type SessionTimelineEventType =
	(typeof SESSION_TIMELINE_EVENT_TYPES)[keyof typeof SESSION_TIMELINE_EVENT_TYPES];

export interface SessionTimelineCardEvent extends SessionTimelineEventBase {
	type: typeof SESSION_TIMELINE_EVENT_TYPES.CARD;
	cardId: string;
}

export interface SessionTimelineAssessmentEvent extends SessionTimelineEventBase {
	type: typeof SESSION_TIMELINE_EVENT_TYPES.ASSESSMENT;
}

export interface SessionTimelineFinishEvent extends SessionTimelineEventBase {
	type: typeof SESSION_TIMELINE_EVENT_TYPES.FINISH;
}

export type SessionTimelineEvent =
	| SessionTimelineCardEvent
	| SessionTimelineAssessmentEvent
	| SessionTimelineFinishEvent;

export type SessionTimeline = SessionTimelineEvent[];
