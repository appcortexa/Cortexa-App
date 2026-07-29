export interface BreathingSessionSummaryFieldViewModel {
	label: string;
	value: string;
}

export interface BreathingSessionSummaryValueViewModel {
	variableKey: string;
	label: string;
	value: string;
}

export interface BreathingSessionIntermediateAssessmentViewModel {
	title: string;
	recordedAt: string;
	values: readonly BreathingSessionSummaryValueViewModel[];
}

export interface BreathingSessionSummaryViewModel {
	details: readonly BreathingSessionSummaryFieldViewModel[];
	initialVariables: readonly BreathingSessionSummaryValueViewModel[];
	intermediateAssessments: readonly BreathingSessionIntermediateAssessmentViewModel[];
	finalVariables: readonly BreathingSessionSummaryValueViewModel[];
}
