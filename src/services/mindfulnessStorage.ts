import type { MindfulnessAssessmentSnapshot, MindfulnessIntermediateAssessment } from "../modules/mindfulness/models/MindfulnessAssessment";
import type {
	MindfulnessSessionSummaryFieldViewModel,
	MindfulnessSessionSummaryViewModel,
} from "../modules/mindfulness/models/MindfulnessSessionSummaryViewModel";
import type { MindfulnessSessionConfig } from "../modules/mindfulness/models/MindfulnessSessionConfig";

const MINDFULNESS_STORAGE_KEY = "reconecta_mindfulness_results_v1";

export interface MindfulnessStoredResult {
	id: string;
	fecha: string;
	hora: string;
	expediente: string;
	startedAt: string;
	endedAt: string;
	configuration: {
		practice: MindfulnessSessionConfig["practice"];
		practiceLabel: string;
		sessionMode: MindfulnessSessionConfig["sessionMode"];
		sessionModeLabel: string;
		durationMinutes: number;
		assessmentFrequency: MindfulnessSessionConfig["assessmentFrequency"];
		assessmentFrequencyLabel: string;
		enabledVariables: MindfulnessSessionConfig["enabledVariables"];
		enabledVariablesLabels: string[];
	};
	initialAssessment: MindfulnessAssessmentSnapshot | null;
	intermediateAssessments: MindfulnessIntermediateAssessment[];
	finalAssessment: MindfulnessAssessmentSnapshot | null;
	summary: MindfulnessSessionSummaryViewModel;
	finalSummary: MindfulnessSessionSummaryFieldViewModel[];
}

export interface SaveMindfulnessResultInput {
	id?: string;
	fecha?: string;
	hora?: string;
	startedAt: string;
	endedAt: string;
	config: MindfulnessSessionConfig;
	initialAssessment: MindfulnessAssessmentSnapshot | null;
	intermediateAssessments: readonly MindfulnessIntermediateAssessment[];
	finalAssessment: MindfulnessAssessmentSnapshot | null;
	summary: MindfulnessSessionSummaryViewModel;
	finalSummary: MindfulnessSessionSummaryFieldViewModel[];
}

function canUseLocalStorage(): boolean {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createResultId(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}

	return `mindfulness-result-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDateTimeStamp(date = new Date()): { fecha: string; hora: string } {
	const fecha = new Intl.DateTimeFormat("es-MX", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);

	const hora = new Intl.DateTimeFormat("es-MX", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	}).format(date);

	return { fecha, hora };
}

function normalizeDate(value: string): string {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return new Date().toISOString();
	}

	return parsed.toISOString();
}

function cloneAssessmentSnapshot(
	snapshot: MindfulnessAssessmentSnapshot | null,
): MindfulnessAssessmentSnapshot | null {
	if (snapshot === null) {
		return null;
	}

	return {
		recordedAt: snapshot.recordedAt,
		values: snapshot.values.map((value) => ({
			variable: value.variable,
			value: value.value,
		})),
	};
}

function cloneIntermediateAssessments(
	assessments: readonly MindfulnessIntermediateAssessment[],
): MindfulnessIntermediateAssessment[] {
	return assessments.map((assessment) => ({
		eventId: assessment.eventId,
		eventTimestampMs: assessment.eventTimestampMs,
		recordedAt: assessment.recordedAt,
		values: assessment.values.map((value) => ({
			variable: value.variable,
			value: value.value,
		})),
	}));
}

function cloneSummary(summary: MindfulnessSessionSummaryViewModel): MindfulnessSessionSummaryViewModel {
	return {
		details: summary.details.map((item) => ({ ...item })),
		initialVariables: summary.initialVariables.map((item) => ({ ...item })),
		intermediateAssessments: summary.intermediateAssessments.map((assessment) => ({
			title: assessment.title,
			recordedAt: assessment.recordedAt,
			values: assessment.values.map((item) => ({ ...item })),
		})),
		finalVariables: summary.finalVariables.map((item) => ({ ...item })),
	};
}

function cloneFinalSummary(
	finalSummary: MindfulnessSessionSummaryFieldViewModel[],
): MindfulnessSessionSummaryFieldViewModel[] {
	return finalSummary.map((item) => ({ ...item }));
}

function practiceLabel(practice: MindfulnessSessionConfig["practice"]): string {
	if (practice === "BREATH") {
		return "Respiración consciente";
	}

	if (practice === "BODY_SCAN") {
		return "Escaneo corporal";
	}

	if (practice === "THOUGHTS") {
		return "Observación de pensamientos";
	}

	if (practice === "EMOTIONS") {
		return "Observación de emociones";
	}

	if (practice === "CRAVING") {
		return "Surf del craving";
	}

	return "Atención en los sentidos";
}

function sessionModeLabel(mode: MindfulnessSessionConfig["sessionMode"]): string {
	return mode === "MANUAL" ? "Manual" : "Automático";
}

function assessmentFrequencyLabel(frequency: MindfulnessSessionConfig["assessmentFrequency"]): string {
	if (frequency === "PERCENT_25") {
		return "Cada 25 %";
	}

	if (frequency === "PERCENT_33") {
		return "Cada 33 %";
	}

	if (frequency === "PERCENT_50") {
		return "Cada 50 %";
	}

	return "Sin registros";
}

function variableLabel(variable: MindfulnessSessionConfig["enabledVariables"][number]): string {
	if (variable === "CRAVING") {
		return "Craving";
	}

	if (variable === "ANXIETY") {
		return "Ansiedad";
	}

	return "Tensión emocional";
}

function readStoredMindfulnessResults(): MindfulnessStoredResult[] {
	if (!canUseLocalStorage()) {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(MINDFULNESS_STORAGE_KEY);
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}

		return (parsed as MindfulnessStoredResult[]).map((result) => ({
			...result,
			initialAssessment: cloneAssessmentSnapshot(result.initialAssessment),
			intermediateAssessments: cloneIntermediateAssessments(result.intermediateAssessments ?? []),
			finalAssessment: cloneAssessmentSnapshot(result.finalAssessment),
			summary: cloneSummary(result.summary),
			finalSummary: cloneFinalSummary(result.finalSummary ?? []),
			configuration: {
				...result.configuration,
				enabledVariables: [...(result.configuration?.enabledVariables ?? [])],
				enabledVariablesLabels: [...(result.configuration?.enabledVariablesLabels ?? [])],
			},
		}));
	} catch {
		return [];
	}
}

function writeStoredMindfulnessResults(results: MindfulnessStoredResult[]): void {
	if (!canUseLocalStorage()) {
		return;
	}

	window.localStorage.setItem(MINDFULNESS_STORAGE_KEY, JSON.stringify(results));
}

export function saveMindfulnessResult(input: SaveMindfulnessResultInput): MindfulnessStoredResult {
	const endedAt = normalizeDate(input.endedAt);
	const startedAt = normalizeDate(input.startedAt);
	const now = new Date(endedAt);
	const timestamp = createDateTimeStamp(now);
	const enabledVariablesLabels = input.config.enabledVariables.map((variable) => variableLabel(variable));

	const record: MindfulnessStoredResult = {
		id: input.id ?? createResultId(),
		fecha: input.fecha ?? timestamp.fecha,
		hora: input.hora ?? timestamp.hora,
		expediente: input.config.expediente.trim(),
		startedAt,
		endedAt,
		configuration: {
			practice: input.config.practice,
			practiceLabel: practiceLabel(input.config.practice),
			sessionMode: input.config.sessionMode,
			sessionModeLabel: sessionModeLabel(input.config.sessionMode),
			durationMinutes: input.config.durationMinutes,
			assessmentFrequency: input.config.assessmentFrequency,
			assessmentFrequencyLabel: assessmentFrequencyLabel(input.config.assessmentFrequency),
			enabledVariables: [...input.config.enabledVariables],
			enabledVariablesLabels,
		},
		initialAssessment: cloneAssessmentSnapshot(input.initialAssessment),
		intermediateAssessments: cloneIntermediateAssessments(input.intermediateAssessments),
		finalAssessment: cloneAssessmentSnapshot(input.finalAssessment),
		summary: cloneSummary(input.summary),
		finalSummary: cloneFinalSummary(input.finalSummary),
	};

	const currentResults = readStoredMindfulnessResults();
	const updatedResults = [record, ...currentResults];
	writeStoredMindfulnessResults(updatedResults);

	return record;
}

export function getAllMindfulnessResults(): MindfulnessStoredResult[] {
	return readStoredMindfulnessResults();
}

export function getMindfulnessResultsByExpediente(expediente: string): MindfulnessStoredResult[] {
	const normalized = expediente.trim().toLowerCase();
	if (!normalized) {
		return [];
	}

	return readStoredMindfulnessResults().filter(
		(result) => result.expediente.trim().toLowerCase() === normalized,
	);
}