import {
	type CravingRecord,
	type CueExposureSession,
	type SessionCheckpoint,
	type SessionConfig,
} from "../types/cueExposure.types";
import { planSessionCheckpoints } from "./sessionPlanner";

function toSessionCheckpoint(second: number): SessionCheckpoint {
	return {
		id: crypto.randomUUID(),
		second,
		recordType: "intermediate",
		isCompleted: false,
	};
}

function buildCravingRecords(config: SessionConfig, checkpointSeconds: number[]): CravingRecord[] {
	const initialRecord: CravingRecord = {
		id: crypto.randomUUID(),
		type: "initial",
		checkpointSecond: 0,
		relativeSecond: 0,
		value: config.initialCraving,
		recordedAt: null,
	};

	const intermediateRecords: CravingRecord[] = checkpointSeconds.map((second) => ({
		id: crypto.randomUUID(),
		type: "intermediate",
		checkpointSecond: second,
		relativeSecond: null,
		value: null,
		recordedAt: null,
	}));

	const finalRecord: CravingRecord = {
		id: crypto.randomUUID(),
		type: "final",
		checkpointSecond: Math.round(config.durationMinutes * 60),
		relativeSecond: null,
		value: null,
		recordedAt: null,
	};

	return [initialRecord, ...intermediateRecords, finalRecord];
}

export function createCueExposureSession(config: SessionConfig): CueExposureSession {
	const checkpointSeconds = planSessionCheckpoints(config.durationMinutes, config.intermediateRecordType);
	const checkpoints = checkpointSeconds.map(toSessionCheckpoint);

	return {
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		startedAt: null,
		finishedAt: null,
		config,
		checkpoints,
		cravingRecords: buildCravingRecords(config, checkpointSeconds),
		state: {
			status: "created",
			elapsedSeconds: 0,
			nextCheckpointIndex: 0,
		},
		result: {
			initialCraving: config.initialCraving,
			finalCraving: null,
			averageIntermediateCraving: null,
			intermediateRecordsCompleted: 0,
			totalIntermediateRecords: checkpoints.length,
		},
	};
}
