import type { IntermediateCravingRecord, SessionResult } from "../pages/urgeSurfing/types/SessionResult";

const URGE_SURFING_STORAGE_KEY = "reconecta_urge_surfing_results_v1";

export interface UrgeSurfingStoredResult {
	id: string;
	fecha: string;
	hora: string;
	expediente: string;
	startedAt: string;
	endedAt: string;
	durationMinutes: number;
	durationSeconds: number;
	cardAdvanceMode: "automatic" | "manual";
	intermediateRecordFrequency: "none" | "25" | "33" | "50";
	initialCraving: number;
	intermediateRecords: IntermediateCravingRecord[];
	finalCraving: number;
}

export type SaveUrgeSurfingResultInput = SessionResult &
	Partial<Pick<UrgeSurfingStoredResult, "id" | "fecha" | "hora">>;

function canUseLocalStorage(): boolean {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createResultId(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}

	return `urge-surfing-result-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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

function normalizeDate(value: Date | string): string {
	if (value instanceof Date) {
		return value.toISOString();
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return new Date().toISOString();
	}

	return parsed.toISOString();
}

function cloneIntermediateRecords(records: IntermediateCravingRecord[]): IntermediateCravingRecord[] {
	return records.map((record) => ({
		secondFromStart: record.secondFromStart,
		craving: record.craving,
	}));
}

function readStoredUrgeSurfingResults(): UrgeSurfingStoredResult[] {
	if (!canUseLocalStorage()) {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(URGE_SURFING_STORAGE_KEY);
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}

		return (parsed as UrgeSurfingStoredResult[]).map((result) => ({
			...result,
			intermediateRecords: cloneIntermediateRecords(result.intermediateRecords ?? []),
		}));
	} catch {
		return [];
	}
}

function writeStoredUrgeSurfingResults(results: UrgeSurfingStoredResult[]): void {
	if (!canUseLocalStorage()) {
		return;
	}

	window.localStorage.setItem(URGE_SURFING_STORAGE_KEY, JSON.stringify(results));
}

export function saveUrgeSurfingResult(result: SaveUrgeSurfingResultInput): UrgeSurfingStoredResult {
	const now = new Date();
	const timestamp = createDateTimeStamp(now);

	const record: UrgeSurfingStoredResult = {
		id: result.id ?? createResultId(),
		fecha: result.fecha ?? timestamp.fecha,
		hora: result.hora ?? timestamp.hora,
		expediente: result.patientId.trim(),
		startedAt: normalizeDate(result.startedAt),
		endedAt: normalizeDate(result.endedAt),
		durationMinutes: result.durationMinutes,
		durationSeconds: result.durationSeconds,
		cardAdvanceMode: result.cardAdvanceMode,
		intermediateRecordFrequency: result.intermediateRecordFrequency,
		initialCraving: result.initialCraving,
		intermediateRecords: cloneIntermediateRecords(result.intermediateRecords),
		finalCraving: result.finalCraving,
	};

	const currentResults = readStoredUrgeSurfingResults();
	const updatedResults = [record, ...currentResults];
	writeStoredUrgeSurfingResults(updatedResults);

	return record;
}

export function getAllUrgeSurfingResults(): UrgeSurfingStoredResult[] {
	return readStoredUrgeSurfingResults();
}

export function getUrgeSurfingResultsByExpediente(expediente: string): UrgeSurfingStoredResult[] {
	const normalized = expediente.trim().toLowerCase();
	if (!normalized) {
		return [];
	}

	return readStoredUrgeSurfingResults().filter(
		(result) => result.expediente.trim().toLowerCase() === normalized,
	);
}