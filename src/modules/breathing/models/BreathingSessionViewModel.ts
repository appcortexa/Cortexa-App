import type { BreathingSessionRuntimeStatus } from "../services/BreathingSessionRuntime";

export interface BreathingSessionViewModel {
	readonly expediente: string;
	readonly patternName: string;
	readonly durationMinutes: number;
	readonly durationLabel: string;
	readonly currentPhase: string;
	readonly instructionText: string;
	readonly remainingMs: number;
	readonly durationMs: number;
	readonly globalProgress: number;
	readonly isAssessmentVisible: boolean;
	readonly runtimeStatus: BreathingSessionRuntimeStatus;
	readonly canBeginSession: boolean;
	readonly beginSessionLabel: string;
}