import type { BreathingAssessment } from "./BreathingAssessment";

export const BREATHING_SESSION_STATUSES = {
	IDLE: "IDLE",
	RUNNING: "RUNNING",
	PAUSED: "PAUSED",
	COMPLETED: "COMPLETED",
	CANCELLED: "CANCELLED",
} as const;

export type BreathingSessionStatus =
	(typeof BREATHING_SESSION_STATUSES)[keyof typeof BREATHING_SESSION_STATUSES];

export interface BreathingSessionState {
	status: BreathingSessionStatus;
	startedAt: string | null;
	endedAt: string | null;
	elapsedSeconds: number;
	remainingSeconds: number;
	currentCycle: number;
	currentPhaseId: string | null;
	initialAssessment: BreathingAssessment | null;
	intermediateAssessments: readonly BreathingAssessment[];
	finalAssessment: BreathingAssessment | null;
}
