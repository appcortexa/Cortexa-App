import type { BreathingAssessmentVariableDefinition } from "./BreathingAssessment";
import type { BreathingPattern } from "./BreathingPattern";
import type { AssessmentFrequency } from "../../mindfulness/models/mindfulness.models";

export const BREATHING_SESSION_MODES = {
	AUTOMATIC: "AUTOMATIC",
	MANUAL: "MANUAL",
} as const;

export type BreathingSessionMode =
	(typeof BREATHING_SESSION_MODES)[keyof typeof BREATHING_SESSION_MODES];

export interface BreathingSessionConfig {
	expediente: string;
	pattern: BreathingPattern;
	durationMinutes: number;
	assessmentFrequency: AssessmentFrequency;
	assessmentVariables: readonly BreathingAssessmentVariableDefinition[];
	sessionMode: BreathingSessionMode;
}
