import type {
	AssessmentFrequency,
	PracticeType,
} from "../models/mindfulness.models";
import type { Timeline } from "./timeline/Timeline";
import {
	TimelineEventType,
	type TimelineEvent,
} from "./timeline/TimelineEvent";

type PromptSequenceLike = readonly unknown[];

interface TimelinePlanningConfig {
	practice: PracticeType;
	durationMinutes: number;
	assessmentFrequency: AssessmentFrequency;
	promptSequence: PromptSequenceLike;
}

interface PlannedEvent extends TimelineEvent {
	readonly order: number;
}

const MILLISECONDS_PER_MINUTE = 60_000;

const ASSESSMENT_PERCENTAGES_BY_FREQUENCY: Record<
	Exclude<AssessmentFrequency, "NONE">,
	readonly number[]
> = {
	PERCENT_25: [25, 50, 75, 100],
	PERCENT_33: [33, 66, 100],
	PERCENT_50: [50, 100],
};

/**
 * Ejemplo esperado:
 * 20 minutos, 12 tarjetas, 25%.
 * START -> 12 SHOW_PROMPT distribuidos uniformemente -> 4 ASSESSMENT -> END.
 */
export function createTimeline(config: TimelinePlanningConfig): Timeline {
	const { practice, durationMinutes, assessmentFrequency, promptSequence } = config;
	void practice;

	const durationMs = toDurationMs(durationMinutes);
	const promptEvents = buildPromptEvents(promptSequence.length, durationMs);
	const assessmentEvents = buildAssessmentEvents(assessmentFrequency, durationMs);

	return {
		durationMs,
		timelineEvents: mergeEvents(promptEvents, assessmentEvents, durationMs),
	};
}

function toDurationMs(durationMinutes: number): number {
	if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
		throw new RangeError("durationMinutes must be a positive finite number");
	}

	return Math.round(durationMinutes * MILLISECONDS_PER_MINUTE);
}

function buildPromptEvents(promptCount: number, durationMs: number): PlannedEvent[] {
	if (promptCount === 0) {
		return [];
	}

	const promptEvents: PlannedEvent[] = [];

	for (let index = 0; index < promptCount; index += 1) {
		const timestampMs = Math.floor((durationMs * index) / promptCount);

		promptEvents.push({
			id: `prompt-${String(index + 1).padStart(3, "0")}`,
			timestampMs,
			type: TimelineEventType.SHOW_PROMPT,
			payload: {
				promptIndex: index,
			},
			order: index + 1,
		});
	}

	return promptEvents;
}

function buildAssessmentEvents(
	assessmentFrequency: AssessmentFrequency,
	durationMs: number,
): PlannedEvent[] {
	if (assessmentFrequency === "NONE") {
		return [];
	}

	const percentages = ASSESSMENT_PERCENTAGES_BY_FREQUENCY[assessmentFrequency];

	return percentages.map((percentage, index) => ({
		id: `assessment-${String(index + 1).padStart(3, "0")}`,
		timestampMs: percentage === 100
			? durationMs
			: Math.floor((durationMs * percentage) / 100),
		type: TimelineEventType.ASSESSMENT,
		payload: {
			percentage,
		},
		order: index,
	}));
}

function mergeEvents(
	promptEvents: PlannedEvent[],
	assessmentEvents: PlannedEvent[],
	durationMs: number,
): TimelineEvent[] {
	const timelineEvents: TimelineEvent[] = [{
		id: TimelineEventType.START,
		timestampMs: 0,
		type: TimelineEventType.START,
	}];

	let promptIndex = 0;
	let assessmentIndex = 0;

	while (promptIndex < promptEvents.length || assessmentIndex < assessmentEvents.length) {
		const nextPromptEvent = promptEvents[promptIndex];
		const nextAssessmentEvent = assessmentEvents[assessmentIndex];

		if (
			nextPromptEvent !== undefined &&
			(
				nextAssessmentEvent === undefined ||
				nextPromptEvent.timestampMs < nextAssessmentEvent.timestampMs
			)
		) {
			timelineEvents.push(stripOrder(nextPromptEvent));
			promptIndex += 1;
			continue;
		}

		if (
			nextAssessmentEvent !== undefined &&
			(
				nextPromptEvent === undefined ||
				nextAssessmentEvent.timestampMs < nextPromptEvent.timestampMs
			)
		) {
			timelineEvents.push(stripOrder(nextAssessmentEvent));
			assessmentIndex += 1;
			continue;
		}

		if (nextPromptEvent !== undefined) {
			timelineEvents.push(stripOrder(nextPromptEvent));
			promptIndex += 1;
		}

		if (nextAssessmentEvent !== undefined) {
			timelineEvents.push(stripOrder(nextAssessmentEvent));
			assessmentIndex += 1;
		}
	}

	timelineEvents.push({
		id: TimelineEventType.END,
		timestampMs: durationMs,
		type: TimelineEventType.END,
	});

	return timelineEvents;
}

function stripOrder(event: PlannedEvent): TimelineEvent {
	const { order: _order, ...timelineEvent } = event;
	void _order;
	return timelineEvent;
}
