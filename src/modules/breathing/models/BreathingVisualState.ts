export interface BreathingVisualState {
	readonly phaseKey: string | null;
	readonly phaseLabel: string | null;
	readonly displayText: string;
	readonly phaseProgress: number;
	readonly sessionProgress: number;
	readonly isAssessmentPause: boolean;
}