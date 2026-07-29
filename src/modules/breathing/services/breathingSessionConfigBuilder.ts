import { mindfulnessConfig } from "../../mindfulness/config/mindfulnessConfig";
import {
	ASSESSMENT_FREQUENCIES,
	ASSESSMENT_VARIABLE_LABELS,
	ASSESSMENT_VARIABLE_QUESTIONS,
	type AssessmentFrequency,
	type AssessmentVariable,
} from "../../mindfulness/models/mindfulness.models";
import type { BreathingAssessmentVariableDefinition } from "../models/BreathingAssessment";
import type { BreathingPattern } from "../models/BreathingPattern";
import {
	BREATHING_SESSION_MODES,
	type BreathingSessionConfig,
} from "../models/BreathingSessionConfig";
import type { BreathingIntermediateAssessmentsConfig } from "../models/BreathingTimeline";

export interface BuildBreathingSessionConfigInput {
	readonly expediente: string;
	readonly pattern: BreathingPattern | null;
	readonly durationMinutes: number;
	readonly assessmentFrequency: AssessmentFrequency;
	readonly assessmentVariables: readonly AssessmentVariable[];
}

const FREQUENCY_TO_CHECKPOINT_RATIOS: Record<AssessmentFrequency, readonly number[]> = {
	[ASSESSMENT_FREQUENCIES.NONE]: [],
	[ASSESSMENT_FREQUENCIES.PERCENT_25]: [0.25, 0.5, 0.75],
	[ASSESSMENT_FREQUENCIES.PERCENT_33]: [1 / 3, 2 / 3],
	[ASSESSMENT_FREQUENCIES.PERCENT_50]: [0.5],
};

export function buildBreathingSessionConfig(
	input: BuildBreathingSessionConfigInput,
): BreathingSessionConfig | null {
	const normalizedExpediente = input.expediente.trim();

	if (!normalizedExpediente || input.pattern === null || !isBreathingDurationValid(input.durationMinutes)) {
		return null;
	}

	return {
		expediente: normalizedExpediente,
		pattern: input.pattern,
		durationMinutes: input.durationMinutes,
		assessmentFrequency: input.assessmentFrequency,
		assessmentVariables: buildBreathingAssessmentVariables(input.assessmentVariables),
		sessionMode: BREATHING_SESSION_MODES.AUTOMATIC,
	};
}

export function buildBreathingAssessmentVariables(
	variables: readonly AssessmentVariable[],
): readonly BreathingAssessmentVariableDefinition[] {
	return variables.map((variable) => ({
		key: variable,
		label: ASSESSMENT_VARIABLE_LABELS[variable],
		question: ASSESSMENT_VARIABLE_QUESTIONS[variable],
		minValue: mindfulnessConfig.minScaleValue,
		maxValue: mindfulnessConfig.maxScaleValue,
	}));
}

export function buildBreathingIntermediateAssessmentsConfig(
	frequency: AssessmentFrequency,
): BreathingIntermediateAssessmentsConfig {
	return {
		checkpointRatios: FREQUENCY_TO_CHECKPOINT_RATIOS[frequency],
	};
}

export function isBreathingDurationValid(durationMinutes: number): boolean {
	return (
		Number.isInteger(durationMinutes) &&
		durationMinutes >= mindfulnessConfig.minDurationMinutes &&
		durationMinutes <= mindfulnessConfig.maxDurationMinutes
	);
}