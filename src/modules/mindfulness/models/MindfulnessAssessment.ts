import type { AssessmentVariable } from "./mindfulness.models";

export interface MindfulnessAssessmentValue {
	variable: AssessmentVariable;
	value: number;
}

export interface MindfulnessAssessmentSnapshot {
	recordedAt: string;
	values: MindfulnessAssessmentValue[];
}

export interface PendingMindfulnessAssessment {
	eventId: string;
	eventTimestampMs: number;
	variables: AssessmentVariable[];
}

export interface MindfulnessIntermediateAssessment {
	eventId: string;
	eventTimestampMs: number;
	recordedAt: string;
	values: MindfulnessAssessmentValue[];
}