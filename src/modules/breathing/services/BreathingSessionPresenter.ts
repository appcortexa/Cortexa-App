import type { BreathingSessionContext } from "../models/BreathingSessionContext";
import type { BreathingSessionViewModel } from "../models/BreathingSessionViewModel";
import { BREATHING_SESSION_RUNTIME_STATUSES } from "./BreathingSessionRuntime";

export type BreathingSessionPresenterListener = () => void;

const PREPARATION_PHASE_LABEL = "Preparación";
const ASSESSMENT_PHASE_LABEL = "Evaluación";

export class BreathingSessionPresenter {
	readonly sessionContext: BreathingSessionContext;

	constructor(sessionContext: BreathingSessionContext) {
		this.sessionContext = sessionContext;
	}

	getViewModel(): BreathingSessionViewModel {
		return buildBreathingSessionViewModel(this.sessionContext);
	}

	subscribe(listener: BreathingSessionPresenterListener): void {
		this.sessionContext.runtime.subscribe(listener);
	}

	unsubscribe(listener: BreathingSessionPresenterListener): void {
		this.sessionContext.runtime.unsubscribe(listener);
	}

	startSession(): void {
		const status = this.sessionContext.runtime.getSnapshot().status;

		if (
			status !== BREATHING_SESSION_RUNTIME_STATUSES.IDLE &&
			status !== BREATHING_SESSION_RUNTIME_STATUSES.PREPARING
		) {
			return;
		}

		this.sessionContext.runtime.startSession();
	}
}

export function buildBreathingSessionViewModel(
	sessionContext: BreathingSessionContext,
): BreathingSessionViewModel {
	const { config, runtime, conductor } = sessionContext;
	const runtimeSnapshot = runtime.getSnapshot();
	const visualState = conductor.getVisualState();
	const durationMs = runtimeSnapshot.timelineDurationMs || sessionContext.timeline.durationMs;
	const elapsedMs = Math.max(0, runtime.clock.getElapsedMs());
	const remainingMs = Math.max(0, durationMs - elapsedMs);

	return {
		expediente: config.expediente,
		patternName: config.pattern.name,
		durationMinutes: config.durationMinutes,
		durationLabel: formatDuration(config.durationMinutes),
		currentPhase: resolveCurrentPhaseLabel(visualState),
		instructionText: visualState.displayText,
		remainingMs,
		durationMs,
		globalProgress: visualState.sessionProgress,
		isAssessmentVisible: visualState.isAssessmentPause,
		runtimeStatus: runtimeSnapshot.status,
		canBeginSession:
			runtimeSnapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.IDLE ||
			runtimeSnapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.PREPARING,
		beginSessionLabel:
			runtimeSnapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.IDLE ||
			runtimeSnapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.PREPARING
				? "Comenzar sesión"
				: runtimeSnapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.RUNNING
					? "Sesión en curso"
					: "Sesión finalizada",
	};
}

function resolveCurrentPhaseLabel(
	visualState: BreathingSessionContext["conductor"] extends { getVisualState(): infer T }
		? T
		: never,
): string {
	if (visualState.isAssessmentPause) {
		return ASSESSMENT_PHASE_LABEL;
	}

	return visualState.phaseLabel ?? PREPARATION_PHASE_LABEL;
}

function formatDuration(durationMinutes: number): string {
	return `${durationMinutes} minuto${durationMinutes === 1 ? "" : "s"}`;
}