import type { BreathingPattern } from "../models/BreathingPattern";
import type { BreathingSessionConfig } from "../models/BreathingSessionConfig";
import {
	BREATHING_TIMELINE_EVENT_TYPES,
	type BreathingIntermediateAssessmentsConfig,
	type BreathingSessionTimeline,
	type BreathingTimelineEvent,
	type BreathingTimelinePhasePlan,
} from "../models/BreathingTimeline";

const EVENT_PRIORITY: Record<BreathingTimelineEvent["type"], number> = {
	[BREATHING_TIMELINE_EVENT_TYPES.START]: 1,
	[BREATHING_TIMELINE_EVENT_TYPES.BREATHING_CYCLE]: 2,
	[BREATHING_TIMELINE_EVENT_TYPES.INTERMEDIATE_ASSESSMENT]: 3,
	[BREATHING_TIMELINE_EVENT_TYPES.END]: 4,
};

export interface BuildBreathingTimelineInput {
	readonly pattern: BreathingPattern;
	readonly sessionConfig: BreathingSessionConfig;
	readonly sessionDurationSeconds: number;
	readonly intermediateAssessmentsConfig: BreathingIntermediateAssessmentsConfig;
	readonly phaseDurationOverridesSeconds?: Readonly<Record<string, number>>;
}

export interface IBreathingTimelineBuilder {
	buildTimeline(input: BuildBreathingTimelineInput): BreathingSessionTimeline;
}

export class BreathingTimelineBuilder implements IBreathingTimelineBuilder {
	buildTimeline(input: BuildBreathingTimelineInput): BreathingSessionTimeline {
		const resolvedPhases = resolvePhasePlan(input.pattern, input.phaseDurationOverridesSeconds);
		const cycleDurationSeconds = resolvedPhases.reduce(
			(total, phase) => total + phase.durationSeconds,
			0,
		);
		const totalCycles =
			cycleDurationSeconds > 0
				? Math.floor(input.sessionDurationSeconds / cycleDurationSeconds)
				: 0;

		const startEvent: BreathingTimelineEvent = {
			id: "start",
			timestampMs: 0,
			type: BREATHING_TIMELINE_EVENT_TYPES.START,
			payload: {
				sessionMode: input.sessionConfig.sessionMode,
				patternId: input.pattern.id,
				patternName: input.pattern.name,
			},
		};

		const cycleEvents: BreathingTimelineEvent[] = Array.from(
			{ length: totalCycles },
			(_, index) => {
				const cycleNumber = index + 1;
				const cycleStartSeconds = index * cycleDurationSeconds;

				return {
					id: `cycle-${cycleNumber}`,
					timestampMs: cycleStartSeconds * 1000,
					type: BREATHING_TIMELINE_EVENT_TYPES.BREATHING_CYCLE,
					payload: {
						cycleNumber,
						cycleDurationSeconds,
						phases: resolvedPhases,
					},
				};
			},
		);

		const assessmentTimesSeconds = buildAssessmentTimesSeconds(
			input.sessionDurationSeconds,
			input.intermediateAssessmentsConfig,
		);
		const assessmentEvents: BreathingTimelineEvent[] = assessmentTimesSeconds.map(
			(second, index) => ({
				id: `assessment-${index + 1}`,
				timestampMs: second * 1000,
				type: BREATHING_TIMELINE_EVENT_TYPES.INTERMEDIATE_ASSESSMENT,
				payload: {
					sequence: index + 1,
				},
			}),
		);

		const endEvent: BreathingTimelineEvent = {
			id: "end",
			timestampMs: input.sessionDurationSeconds * 1000,
			type: BREATHING_TIMELINE_EVENT_TYPES.END,
			payload: {
				totalCycles,
			},
		};

		const timelineEvents = freezeTimelineEvents(
			[...cycleEvents, ...assessmentEvents, startEvent, endEvent]
				.filter((event) => isTimestampInRange(event.timestampMs, input.sessionDurationSeconds))
				.sort((left, right) => {
					if (left.timestampMs !== right.timestampMs) {
						return left.timestampMs - right.timestampMs;
					}

					return EVENT_PRIORITY[left.type] - EVENT_PRIORITY[right.type];
				}),
		);

		return Object.freeze({
			sessionId: input.sessionConfig.expediente,
			patternId: input.pattern.id,
			cycleDurationSeconds,
			totalCycles,
			durationMs: input.sessionDurationSeconds * 1000,
			timelineEvents,
		});
	}
}

function resolvePhasePlan(
	pattern: BreathingPattern,
	overrides?: Readonly<Record<string, number>>,
): readonly BreathingTimelinePhasePlan[] {
	return pattern.phases.map((phase) => {
		const fallbackDuration = phase.durationSeconds;
		const overrideDuration = overrides?.[phase.key];
		const durationSeconds = overrideDuration ?? fallbackDuration;

		if (durationSeconds === null || !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
			throw new Error(`La fase "${phase.key}" requiere una duracion valida mayor a 0.`);
		}

		return Object.freeze({
			id: phase.id,
			key: phase.key,
			label: phase.label,
			durationSeconds,
		});
	});
}

function buildAssessmentTimesSeconds(
	sessionDurationSeconds: number,
	config: BreathingIntermediateAssessmentsConfig,
): readonly number[] {
	const seconds = config.checkpointRatios.map((ratio) =>
		Math.round(sessionDurationSeconds * ratio),
	);

	return [...new Set(seconds)]
		.filter((second) => Number.isInteger(second) && second > 0 && second < sessionDurationSeconds)
		.sort((left, right) => left - right);
}

function isTimestampInRange(timestampMs: number, sessionDurationSeconds: number): boolean {
	const durationMs = sessionDurationSeconds * 1000;
	return Number.isInteger(timestampMs) && timestampMs >= 0 && timestampMs <= durationMs;
}

function freezeTimelineEvents(events: readonly BreathingTimelineEvent[]): readonly BreathingTimelineEvent[] {
	return Object.freeze(
		events.map((event) =>
			Object.freeze({
				...event,
				payload: event.payload ? Object.freeze(event.payload) : undefined,
			}),
		),
	);
}
