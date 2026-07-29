import type { AssessmentVariable } from "./mindfulness.models";

export interface MindfulnessSessionSummaryFieldViewModel {
	label: string;
	value: string;
}

export interface MindfulnessSessionSummaryValueViewModel {
	variable: AssessmentVariable;
	label: string;
	value: string;
}

export interface MindfulnessSessionIntermediateAssessmentViewModel {
	title: string;
	recordedAt: string;
	values: readonly MindfulnessSessionSummaryValueViewModel[];
}

export interface MindfulnessSessionSummaryViewModel {
	details: readonly MindfulnessSessionSummaryFieldViewModel[];
	initialVariables: readonly MindfulnessSessionSummaryValueViewModel[];
	intermediateAssessments: readonly MindfulnessSessionIntermediateAssessmentViewModel[];
	finalVariables: readonly MindfulnessSessionSummaryValueViewModel[];
}