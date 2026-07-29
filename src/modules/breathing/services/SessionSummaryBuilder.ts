import type {
	BreathingAssessment,
	BreathingAssessmentValue,
} from "../models/BreathingAssessment";
import type {
	BreathingSessionIntermediateAssessmentViewModel,
	BreathingSessionSummaryFieldViewModel,
	BreathingSessionSummaryValueViewModel,
	BreathingSessionSummaryViewModel,
} from "../models/BreathingSessionSummaryViewModel";
import type { SessionDataCollector } from "./SessionDataCollector";

type VariableLabelMap = Readonly<Record<string, string>>;

export interface SessionSummaryBuilderOptions {
	readonly variableLabelsByKey?: VariableLabelMap;
}

const EMPTY_VALUE_LABEL = "No registrado";

class SessionSummaryBuilder {
	private readonly sessionDataCollector: SessionDataCollector;
	private readonly variableLabelsByKey: VariableLabelMap;

	constructor(sessionDataCollector: SessionDataCollector, options?: SessionSummaryBuilderOptions) {
		this.sessionDataCollector = sessionDataCollector;
		this.variableLabelsByKey = options?.variableLabelsByKey ?? {};
	}

	build(): BreathingSessionSummaryViewModel {
		const snapshot = this.sessionDataCollector.getSnapshot();

		return {
			details: this.buildDetails(snapshot),
			initialVariables: this.buildAssessmentValues(snapshot.initialAssessment),
			intermediateAssessments: this.buildIntermediateAssessments(snapshot.intermediateAssessments),
			finalVariables: this.buildAssessmentValues(snapshot.finalAssessment),
		};
	}

	private buildDetails(snapshot: ReturnType<SessionDataCollector["getSnapshot"]>): readonly BreathingSessionSummaryFieldViewModel[] {
		const assessmentKeys = snapshot.metadata.assessmentVariableKeys;

		return [
			this.buildDetail("Expediente", snapshot.metadata.expediente),
			this.buildDetail("Patrón respiratorio", snapshot.metadata.patternName),
			this.buildDetail("Duración", this.formatDuration(snapshot.metadata.durationMinutes)),
			this.buildDetail("Frecuencia de evaluación", snapshot.metadata.assessmentFrequency),
			this.buildDetail("Modo de sesión", snapshot.metadata.sessionMode),
			this.buildDetail(
				"Variables de evaluación",
				assessmentKeys.length > 0 ? assessmentKeys.join(", ") : EMPTY_VALUE_LABEL,
			),
			this.buildDetail("Creada en", snapshot.timestamps.createdAt),
			this.buildDetail("Actualizada en", snapshot.timestamps.updatedAt),
			this.buildDetail("Inicio de sesión", this.formatTimestamp(snapshot.timestamps.sessionStartedAt)),
			this.buildDetail("Fin de sesión", this.formatTimestamp(snapshot.timestamps.sessionFinishedAt)),
			this.buildDetail(
				"Evaluación inicial",
				this.formatTimestamp(snapshot.timestamps.initialAssessmentAt),
			),
			this.buildDetail(
				"Evaluaciones intermedias",
				snapshot.timestamps.intermediateAssessmentAt.length.toString(),
			),
			this.buildDetail("Evaluación final", this.formatTimestamp(snapshot.timestamps.finalAssessmentAt)),
		];
	}

	private buildIntermediateAssessments(
		assessments: ReturnType<SessionDataCollector["getSnapshot"]>["intermediateAssessments"],
	): readonly BreathingSessionIntermediateAssessmentViewModel[] {
		return assessments.map((assessment, index) => ({
			title: this.buildIntermediateTitle(index, assessment.assessmentEventId),
			recordedAt: assessment.recordedAt,
			values: this.mapAssessmentValues(assessment.values),
		}));
	}

	private buildIntermediateTitle(index: number, assessmentEventId: string | null): string {
		const baseTitle = `Evaluación intermedia ${index + 1}`;
		if (assessmentEventId === null || !assessmentEventId.trim()) {
			return baseTitle;
		}

		return `${baseTitle} (${assessmentEventId})`;
	}

	private buildAssessmentValues(
		assessment: BreathingAssessment | null,
	): readonly BreathingSessionSummaryValueViewModel[] {
		if (assessment === null) {
			return [];
		}

		return this.mapAssessmentValues(assessment.values);
	}

	private mapAssessmentValues(
		values: readonly BreathingAssessmentValue[],
	): readonly BreathingSessionSummaryValueViewModel[] {
		return values.map((value) => ({
			variableKey: value.variableKey,
			label: this.resolveVariableLabel(value.variableKey),
			value: value.value.toString(),
		}));
	}

	private resolveVariableLabel(variableKey: string): string {
		return this.variableLabelsByKey[variableKey] ?? variableKey;
	}

	private buildDetail(label: string, value: string): BreathingSessionSummaryFieldViewModel {
		return { label, value };
	}

	private formatDuration(durationMinutes: number): string {
		return `${durationMinutes} min`;
	}

	private formatTimestamp(value: string | null): string {
		return value ?? EMPTY_VALUE_LABEL;
	}
}

function buildBreathingSessionSummaryViewModel(
	sessionDataCollector: SessionDataCollector,
	options?: SessionSummaryBuilderOptions,
): BreathingSessionSummaryViewModel {
	return new SessionSummaryBuilder(sessionDataCollector, options).build();
}

export { SessionSummaryBuilder, buildBreathingSessionSummaryViewModel };