import type { BreathingVisualState } from "../models/BreathingVisualState";
import {
	BREATHING_TIMELINE_EVENT_TYPES,
	type BreathingTimelineCyclePayload,
	type BreathingTimelineEvent,
	type BreathingTimelinePhasePlan,
} from "../models/BreathingTimeline";
import {
	BREATHING_SESSION_RUNTIME_STATUSES,
	type BreathingSessionRuntime,
	type BreathingSessionRuntimeSnapshot,
} from "./BreathingSessionRuntime";

export type BreathingConductorListener = () => void;

const PHASE_DISPLAY_TEXT_BY_KEY = {
	INHALE: "Inhala",
	HOLD: "Mantén",
	HOLD_FULL: "Mantén",
	HOLD_EMPTY: "Mantén",
	EXHALE: "Exhala",
	REST: "Descansa",
} as const;

const PREPARING_TEXT = "Prepárate";
const ASSESSMENT_TEXT = "Pausa para evaluación";
const COMPLETE_TEXT = "Descansa";

export class BreathingConductor {
	readonly runtime: BreathingSessionRuntime;

	constructor(runtime: BreathingSessionRuntime) {
		this.runtime = runtime;
	}

	getVisualState(): BreathingVisualState {
		return buildBreathingVisualState(this.runtime);
	}

	subscribe(listener: BreathingConductorListener): void {
		this.runtime.subscribe(listener);
	}

	unsubscribe(listener: BreathingConductorListener): void {
		this.runtime.unsubscribe(listener);
	}
}

export function buildBreathingVisualState(
	runtime: BreathingSessionRuntime,
): BreathingVisualState {
	const snapshot = runtime.getSnapshot();
	const currentEvent = snapshot.currentEvent ?? runtime.getCurrentEvent();
	const timelineDurationMs = Math.max(0, snapshot.timelineDurationMs);
	const elapsedMs = clamp(runtime.clock.getElapsedMs(), 0, timelineDurationMs);
	const isAssessmentPause =
		snapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT ||
		currentEvent?.type === BREATHING_TIMELINE_EVENT_TYPES.INTERMEDIATE_ASSESSMENT;
	const sessionProgress = resolveSessionProgress({
		snapshot,
		currentEvent,
		elapsedMs,
		timelineDurationMs,
	});

	if (isAssessmentPause) {
		return {
			phaseKey: null,
			phaseLabel: null,
			displayText: ASSESSMENT_TEXT,
			phaseProgress: 0,
			sessionProgress,
			isAssessmentPause: true,
		};
	}

	if (currentEvent === null) {
		return {
			phaseKey: null,
			phaseLabel: null,
			displayText: resolveIdleDisplayText(snapshot),
			phaseProgress: snapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED ? 1 : 0,
			sessionProgress,
			isAssessmentPause: false,
		};
	}

	if (currentEvent.type === BREATHING_TIMELINE_EVENT_TYPES.START) {
		return {
			phaseKey: null,
			phaseLabel: null,
			displayText: PREPARING_TEXT,
			phaseProgress: 0,
			sessionProgress,
			isAssessmentPause: false,
		};
	}

	if (currentEvent.type === BREATHING_TIMELINE_EVENT_TYPES.END) {
		return {
			phaseKey: null,
			phaseLabel: null,
			displayText: COMPLETE_TEXT,
			phaseProgress: 1,
			sessionProgress: 1,
			isAssessmentPause: false,
		};
	}

	if (currentEvent.type !== BREATHING_TIMELINE_EVENT_TYPES.BREATHING_CYCLE) {
		return {
			phaseKey: null,
			phaseLabel: null,
			displayText: PREPARING_TEXT,
			phaseProgress: 0,
			sessionProgress,
			isAssessmentPause: false,
		};
	}

	if (!isCyclePayload(currentEvent.payload)) {
		return {
			phaseKey: null,
			phaseLabel: null,
			displayText: PREPARING_TEXT,
			phaseProgress: 0,
			sessionProgress,
			isAssessmentPause: false,
		};
	}

	const activePhase = resolveActivePhase(currentEvent.payload, elapsedMs, currentEvent.timestampMs);

	if (activePhase === null) {
		return {
			phaseKey: null,
			phaseLabel: null,
			displayText: PREPARING_TEXT,
			phaseProgress: 0,
			sessionProgress,
			isAssessmentPause: false,
		};
	}

	return {
		phaseKey: activePhase.phase.key,
		phaseLabel: activePhase.phase.label,
		displayText: resolvePhaseDisplayText(activePhase.phase),
		phaseProgress: activePhase.progress,
		sessionProgress,
		isAssessmentPause: false,
	};
}

function resolveIdleDisplayText(snapshot: BreathingSessionRuntimeSnapshot): string {
	if (snapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED) {
		return COMPLETE_TEXT;
	}

	if (snapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED) {
		return COMPLETE_TEXT;
	}

	return PREPARING_TEXT;
}

function resolveSessionProgress(input: {
	snapshot: BreathingSessionRuntimeSnapshot;
	currentEvent: BreathingTimelineEvent | null;
	elapsedMs: number;
	timelineDurationMs: number;
}): number {
	const { snapshot, currentEvent, elapsedMs, timelineDurationMs } = input;

	if (snapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED) {
		return 1;
	}

	if (timelineDurationMs <= 0) {
		return 0;
	}

	if (currentEvent?.type === BREATHING_TIMELINE_EVENT_TYPES.END) {
		return 1;
	}

	return clamp(elapsedMs / timelineDurationMs, 0, 1);
}

function resolveActivePhase(
	payload: BreathingTimelineCyclePayload,
	elapsedMs: number,
	cycleStartMs: number,
): { phase: BreathingTimelinePhasePlan; progress: number } | null {
	const phases = payload.phases.filter((phase) => Number.isFinite(phase.durationSeconds) && phase.durationSeconds > 0);

	if (phases.length === 0) {
		return null;
	}

	const cycleDurationMs = Math.max(0, payload.cycleDurationSeconds * 1000);
	const cycleElapsedMs = clamp(elapsedMs - cycleStartMs, 0, cycleDurationMs);
	let accumulatedMs = 0;

	for (const phase of phases) {
		const phaseDurationMs = phase.durationSeconds * 1000;
		const phaseEndMs = accumulatedMs + phaseDurationMs;

		if (cycleElapsedMs < phaseEndMs || phase === phases[phases.length - 1]) {
			const phaseElapsedMs = clamp(cycleElapsedMs - accumulatedMs, 0, phaseDurationMs);
			return {
				phase,
				progress: phaseDurationMs === 0 ? 0 : clamp(phaseElapsedMs / phaseDurationMs, 0, 1),
			};
		}

		accumulatedMs = phaseEndMs;
	}

	return null;
}

function resolvePhaseDisplayText(phase: BreathingTimelinePhasePlan): string {
	return PHASE_DISPLAY_TEXT_BY_KEY[phase.key as keyof typeof PHASE_DISPLAY_TEXT_BY_KEY] ?? phase.label;
}

function isCyclePayload(
	payload: BreathingTimelineEvent["payload"],
): payload is BreathingTimelineCyclePayload {
	return payload !== undefined && "phases" in payload && "cycleDurationSeconds" in payload;
}

function clamp(value: number, min: number, max: number): number {
	if (Number.isNaN(value)) {
		return min;
	}

	return Math.min(Math.max(value, min), max);
}