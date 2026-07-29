export interface BreathingAssessmentVariableDefinition {
	key: string;
	label: string;
	question: string;
	minValue: number;
	maxValue: number;
	metadata?: Record<string, unknown>;
}

export interface BreathingAssessmentValue {
	variableKey: string;
	value: number;
}

export interface BreathingAssessment {
	recordedAt: string;
	values: readonly BreathingAssessmentValue[];
}
