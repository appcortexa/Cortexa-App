import type {
	BreathingSessionIntermediateAssessmentViewModel,
	BreathingSessionSummaryFieldViewModel,
	BreathingSessionSummaryValueViewModel,
	BreathingSessionSummaryViewModel,
} from "../models/BreathingSessionSummaryViewModel";
import type {
	BreathingStorageFieldRecord,
	BreathingStorageIntermediateAssessmentRecord,
	BreathingStorageRecord,
	BreathingStorageValueRecord,
} from "./BreathingStorageRecord";

function cloneFieldItems(
	items: readonly BreathingSessionSummaryFieldViewModel[] | readonly BreathingStorageFieldRecord[],
): BreathingStorageFieldRecord[] {
	return items.map((item) => ({
		label: item.label,
		value: item.value,
	}));
}

function cloneValueItems(
	items: readonly BreathingSessionSummaryValueViewModel[] | readonly BreathingStorageValueRecord[],
): BreathingStorageValueRecord[] {
	return items.map((item) => ({
		variableKey: item.variableKey,
		label: item.label,
		value: item.value,
	}));
}

function cloneIntermediateAssessmentsToRecord(
	assessments: readonly BreathingSessionIntermediateAssessmentViewModel[],
): BreathingStorageIntermediateAssessmentRecord[] {
	return assessments.map((assessment) => ({
		title: assessment.title,
		recordedAt: assessment.recordedAt,
		values: cloneValueItems(assessment.values),
	}));
}

function cloneIntermediateAssessmentsToViewModel(
	assessments: readonly BreathingStorageIntermediateAssessmentRecord[],
): BreathingSessionIntermediateAssessmentViewModel[] {
	return assessments.map((assessment) => ({
		title: assessment.title,
		recordedAt: assessment.recordedAt,
		values: cloneValueItems(assessment.values),
	}));
}

export class BreathingSessionPersistenceMapper {
	static toStorageRecord(summary: BreathingSessionSummaryViewModel): BreathingStorageRecord {
		return {
			details: cloneFieldItems(summary.details),
			initialVariables: cloneValueItems(summary.initialVariables),
			intermediateAssessments: cloneIntermediateAssessmentsToRecord(summary.intermediateAssessments),
			finalVariables: cloneValueItems(summary.finalVariables),
		};
	}

	static toSummaryViewModel(record: BreathingStorageRecord): BreathingSessionSummaryViewModel {
		return {
			details: cloneFieldItems(record.details),
			initialVariables: cloneValueItems(record.initialVariables),
			intermediateAssessments: cloneIntermediateAssessmentsToViewModel(record.intermediateAssessments),
			finalVariables: cloneValueItems(record.finalVariables),
		};
	}
}
