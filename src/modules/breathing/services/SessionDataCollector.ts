import type {
	BreathingAssessment,
	BreathingAssessmentValue,
} from "../models/BreathingAssessment";

export interface BreathingSessionMetadata {
	expediente: string;
	patternName: string;
	durationMinutes: number;
	assessmentFrequency: string;
	assessmentVariableKeys: readonly string[];
	sessionMode: string;
}

export interface BreathingIntermediateAssessmentRecord extends BreathingAssessment {
	assessmentEventId: string | null;
}

export interface BreathingSessionDataTimestamps {
	createdAt: string;
	updatedAt: string;
	sessionStartedAt: string | null;
	sessionFinishedAt: string | null;
	initialAssessmentAt: string | null;
	intermediateAssessmentAt: readonly string[];
	finalAssessmentAt: string | null;
}

export interface BreathingSessionCollectedData {
	metadata: BreathingSessionMetadata;
	initialAssessment: BreathingAssessment | null;
	intermediateAssessments: readonly BreathingIntermediateAssessmentRecord[];
	finalAssessment: BreathingAssessment | null;
	timestamps: BreathingSessionDataTimestamps;
}

export interface RecordIntermediateAssessmentInput {
	assessmentEventId?: string | null;
	recordedAt?: string;
	values: readonly BreathingAssessmentValue[];
}

class SessionDataCollector {
	private readonly metadata: BreathingSessionMetadata;
	private readonly createdAt: string;
	private updatedAt: string;
	private sessionStartedAt: string | null = null;
	private sessionFinishedAt: string | null = null;
	private initialAssessment: BreathingAssessment | null = null;
	private intermediateAssessments: BreathingIntermediateAssessmentRecord[] = [];
	private finalAssessment: BreathingAssessment | null = null;

	constructor(metadata: BreathingSessionMetadata, createdAt?: string) {
		this.metadata = {
			...metadata,
			assessmentVariableKeys: [...metadata.assessmentVariableKeys],
		};
		this.createdAt = createdAt ?? SessionDataCollector.now();
		this.updatedAt = this.createdAt;
	}

	markSessionStarted(startedAt?: string): void {
		if (this.sessionStartedAt !== null) {
			return;
		}

		this.sessionStartedAt = startedAt ?? SessionDataCollector.now();
		this.touch(this.sessionStartedAt);
	}

	markSessionFinished(finishedAt?: string): void {
		if (this.sessionFinishedAt !== null) {
			return;
		}

		this.sessionFinishedAt = finishedAt ?? SessionDataCollector.now();
		this.touch(this.sessionFinishedAt);
	}

	recordInitialAssessment(values: readonly BreathingAssessmentValue[], recordedAt?: string): void {
		const timestamp = recordedAt ?? SessionDataCollector.now();
		this.initialAssessment = {
			recordedAt: timestamp,
			values: SessionDataCollector.cloneValues(values),
		};
		this.touch(timestamp);
	}

	recordIntermediateAssessment(input: RecordIntermediateAssessmentInput): void {
		const timestamp = input.recordedAt ?? SessionDataCollector.now();
		this.intermediateAssessments = [
			...this.intermediateAssessments,
			{
				assessmentEventId: input.assessmentEventId ?? null,
				recordedAt: timestamp,
				values: SessionDataCollector.cloneValues(input.values),
			},
		];
		this.touch(timestamp);
	}

	recordFinalAssessment(values: readonly BreathingAssessmentValue[], recordedAt?: string): void {
		const timestamp = recordedAt ?? SessionDataCollector.now();
		this.finalAssessment = {
			recordedAt: timestamp,
			values: SessionDataCollector.cloneValues(values),
		};
		this.touch(timestamp);
	}

	getSnapshot(): BreathingSessionCollectedData {
		return {
			metadata: {
				...this.metadata,
				assessmentVariableKeys: [...this.metadata.assessmentVariableKeys],
			},
			initialAssessment:
				this.initialAssessment === null
					? null
					: {
						recordedAt: this.initialAssessment.recordedAt,
						values: SessionDataCollector.cloneValues(this.initialAssessment.values),
					},
			intermediateAssessments: this.intermediateAssessments.map((assessment) => ({
				assessmentEventId: assessment.assessmentEventId,
				recordedAt: assessment.recordedAt,
				values: SessionDataCollector.cloneValues(assessment.values),
			})),
			finalAssessment:
				this.finalAssessment === null
					? null
					: {
						recordedAt: this.finalAssessment.recordedAt,
						values: SessionDataCollector.cloneValues(this.finalAssessment.values),
					},
			timestamps: {
				createdAt: this.createdAt,
				updatedAt: this.updatedAt,
				sessionStartedAt: this.sessionStartedAt,
				sessionFinishedAt: this.sessionFinishedAt,
				initialAssessmentAt: this.initialAssessment?.recordedAt ?? null,
				intermediateAssessmentAt: this.intermediateAssessments.map(
					(assessment) => assessment.recordedAt,
				),
				finalAssessmentAt: this.finalAssessment?.recordedAt ?? null,
			},
		};
	}

	private touch(updatedAt?: string): void {
		this.updatedAt = updatedAt ?? SessionDataCollector.now();
	}

	private static cloneValues(
		values: readonly BreathingAssessmentValue[],
	): readonly BreathingAssessmentValue[] {
		return values.map((value) => ({
			variableKey: value.variableKey,
			value: value.value,
		}));
	}

	private static now(): string {
		return new Date().toISOString();
	}
}

export { SessionDataCollector };