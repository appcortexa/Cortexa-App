export interface BreathingStorageFieldRecord {
	label: string;
	value: string;
}

export interface BreathingStorageValueRecord {
	variableKey: string;
	label: string;
	value: string;
}

export interface BreathingStorageIntermediateAssessmentRecord {
	title: string;
	recordedAt: string;
	values: BreathingStorageValueRecord[];
}

export interface BreathingStorageRecord {
	details: BreathingStorageFieldRecord[];
	initialVariables: BreathingStorageValueRecord[];
	intermediateAssessments: BreathingStorageIntermediateAssessmentRecord[];
	finalVariables: BreathingStorageValueRecord[];
}
