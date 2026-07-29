import type { IntermediateRecordType } from "../types/cueExposure.types";

const RECORD_RATIO_MAP: Readonly<Record<Exclude<IntermediateRecordType, "none">, readonly number[]>> = {
	"25": [0.25, 0.5, 0.75],
	"33": [1 / 3, 2 / 3],
	"50": [0.5],
};

function validateDuration(durationMinutes: number): void {
	if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
		throw new Error("La duracion debe ser un numero mayor a 0.");
	}
}

export function planSessionCheckpoints(
	durationMinutes: number,
	recordType: IntermediateRecordType,
): number[] {
	validateDuration(durationMinutes);

	if (recordType === "none") {
		return [];
	}

	const durationSeconds = Math.round(durationMinutes * 60);
	const ratios = RECORD_RATIO_MAP[recordType];
	const uniqueSeconds = new Set<number>();

	for (const ratio of ratios) {
		const second = Math.round(durationSeconds * ratio);

		if (second > 0 && second < durationSeconds) {
			uniqueSeconds.add(second);
		}
	}

	return Array.from(uniqueSeconds).sort((a, b) => a - b);
}
