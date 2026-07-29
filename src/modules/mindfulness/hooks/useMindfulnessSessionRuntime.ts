import { useCallback, useEffect, useSyncExternalStore } from "react";

import { SESSION_STATES } from "../engine/state/SessionState";
import type { MindfulnessPromptViewModel } from "../models/MindfulnessPromptViewModel";
import type {
	MindfulnessAssessmentValue,
	PendingMindfulnessAssessment,
} from "../models/MindfulnessAssessment";
import {
	buildMindfulnessPromptViewModel,
	type MindfulnessSessionRuntime,
} from "../services/mindfulnessSessionRuntime";

const runtimeSnapshots = new WeakMap<MindfulnessSessionRuntime, string>();

export interface UseMindfulnessSessionRuntimeApi {
	runtime: MindfulnessSessionRuntime | null;
	remainingMs: number;
	durationMs: number;
	isComplete: boolean;
	isPaused: boolean;
	pendingAssessment: PendingMindfulnessAssessment | null;
	promptViewModel: MindfulnessPromptViewModel | null;
	handleSubmitAssessment: (values: readonly MindfulnessAssessmentValue[]) => void;
	handleTogglePauseResume: () => void;
	nextPrompt: () => void;
	handleFinishSession: () => void;
}

function getRuntimeSnapshot(runtime: MindfulnessSessionRuntime | null): string {
	if (!runtime) {
		return "idle";
	}

	return `${runtime.clock.getElapsedMs()}-${runtime.clock.isRunning()}-${runtime.engine.getState()}-${runtime.engine.getCurrentEvent()?.id ?? "none"}-${runtime.pendingAssessment?.eventId ?? "none"}-${runtime.intermediateAssessments.length}`;
}

function getCachedRuntimeSnapshot(runtime: MindfulnessSessionRuntime | null): string {
	if (!runtime) {
		return "idle";
	}

	const cachedSnapshot = runtimeSnapshots.get(runtime);

	if (cachedSnapshot !== undefined) {
		return cachedSnapshot;
	}

	const initialSnapshot = getRuntimeSnapshot(runtime);
	runtimeSnapshots.set(runtime, initialSnapshot);
	return initialSnapshot;
}

export function useMindfulnessSessionRuntime(runtime: MindfulnessSessionRuntime | null): UseMindfulnessSessionRuntimeApi {
	const subscribe = useCallback((onStoreChange: () => void) => {
		if (!runtime) {
			return () => undefined;
		}

		const handleStoreChange = () => {
			const nextSnapshot = getRuntimeSnapshot(runtime);
			const prevSnapshot = runtimeSnapshots.get(runtime);

			if (nextSnapshot === prevSnapshot) {
				return;
			}

			runtimeSnapshots.set(runtime, nextSnapshot);
			onStoreChange();
		};

		runtime.subscribe(handleStoreChange);
		return () => runtime.unsubscribe(handleStoreChange);
	}, [runtime]);

	useSyncExternalStore(subscribe, () => getCachedRuntimeSnapshot(runtime), () => "idle");

	useEffect(() => {
		if (!runtime) {
			return;
		}

		if (runtime.engine.getState() === SESSION_STATES.READY) {
			runtime.startSession();
		}
	}, [runtime]);

	const remainingMs = runtime?.clock.getRemainingMs() ?? 0;
	const durationMs = runtime?.engine.getTimeline()?.durationMs ?? 0;
	const currentState = runtime?.engine.getState() ?? SESSION_STATES.IDLE;
	const isComplete = currentState === SESSION_STATES.FINISHED;
	const isPaused = currentState === SESSION_STATES.PAUSED || currentState === SESSION_STATES.ASSESSMENT;
	const pendingAssessment = runtime?.pendingAssessment ?? null;

	const promptViewModel = !runtime
		? null
		: isComplete
			? {
					title: "Sesion finalizada",
					message: "La sesión ha concluido.",
				}
			: buildMindfulnessPromptViewModel(runtime);

	function handleSubmitAssessment(values: readonly MindfulnessAssessmentValue[]): void {
		if (!runtime || pendingAssessment === null) {
			return;
		}

		runtime.submitAssessment(values);
	}

	function handleTogglePauseResume(): void {
		if (!runtime || isComplete || pendingAssessment !== null) {
			return;
		}

		if (runtime.engine.getState() === SESSION_STATES.PAUSED) {
			runtime.resumeSession();
			return;
		}

		runtime.pauseSession();
	}

	function nextPrompt(): void {
		if (!runtime || isComplete) {
			return;
		}

		runtime.nextPrompt();
	}

	function handleFinishSession(): void {
		if (!runtime || isComplete) {
			return;
		}

		runtime.finishSession();
	}

	return {
		runtime,
		remainingMs,
		durationMs,
		isComplete,
		isPaused,
		pendingAssessment,
		promptViewModel,
		handleSubmitAssessment,
		handleTogglePauseResume,
		nextPrompt,
		handleFinishSession,
	};
}
