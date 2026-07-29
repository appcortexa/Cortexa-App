import type { CueExposureSession } from "../pages/cueExposure/types/cueExposure.types";

const CUE_EXPOSURE_STORAGE_KEY = "reconecta_cue_exposure_results_v1";

export interface CueExposureIntermediateRecord {
	checkpointSecond: number;
	relativeSecond: number | null;
	value: number | null;
	recordedAt: string | null;
}

export interface CueExposureResult {
	id: string;
	fecha: string;
	hora: string;
	expediente: string;
	sustancia: string;
	duracion: number;
	cravingInicial: number | null;
	registrosIntermedios: CueExposureIntermediateRecord[];
	cravingFinal: number | null;
}

function pad2(value: number): string {
	return String(value).padStart(2, "0");
}

function formatLocalDateTime(isoDate: string): { fecha: string; hora: string } {
	const date = new Date(isoDate);

	const fecha = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
	const hora = `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;

	return { fecha, hora };
}

function readStoredCueExposureResults(): CueExposureResult[] {
	const raw = window.localStorage.getItem(CUE_EXPOSURE_STORAGE_KEY);

	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as CueExposureResult[]) : [];
	} catch {
		return [];
	}
}

function writeStoredCueExposureResults(results: CueExposureResult[]): void {
	window.localStorage.setItem(CUE_EXPOSURE_STORAGE_KEY, JSON.stringify(results));
}

export function saveCueExposureResult(result: CueExposureResult): CueExposureResult {
	const currentResults = readStoredCueExposureResults();
	const updatedResults = [result, ...currentResults];

	writeStoredCueExposureResults(updatedResults);

	return result;
}

export function getAllCueExposureResults(): CueExposureResult[] {
	return readStoredCueExposureResults();
}

export function getCueExposureResultsByExpediente(expediente: string): CueExposureResult[] {
	const normalized = expediente.trim();
	if (!normalized) {
		return [];
	}

	return readStoredCueExposureResults().filter((result) => result.expediente === normalized);
}

export function clearCueExposureResults(): void {
	window.localStorage.removeItem(CUE_EXPOSURE_STORAGE_KEY);
}

export function createCueExposureResultFromSession(session: CueExposureSession): CueExposureResult {
	const timestamp = session.finishedAt ?? session.startedAt ?? session.createdAt;
	const { fecha, hora } = formatLocalDateTime(timestamp);

	return {
		id: session.id,
		fecha,
		hora,
		expediente: session.config.expediente,
		sustancia: session.config.substanceId,
		duracion: session.config.durationMinutes,
		cravingInicial: session.result.initialCraving,
		registrosIntermedios: session.cravingRecords
			.filter((record) => record.type === "intermediate")
			.map((record) => ({
				checkpointSecond: record.checkpointSecond,
				relativeSecond: record.relativeSecond,
				value: record.value,
				recordedAt: record.recordedAt,
			})),
		cravingFinal: session.result.finalCraving,
	};
}
