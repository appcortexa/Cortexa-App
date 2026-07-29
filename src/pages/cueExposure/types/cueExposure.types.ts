export type IntermediateRecordType = "none" | "25" | "33" | "50";

export type CravingRecordType = "initial" | "intermediate" | "final";

export interface SessionConfig {
	expediente: string;
	substanceId: string;
	durationMinutes: number;
	initialCraving: number;
	intermediateRecordType: IntermediateRecordType;
}

export interface SessionCheckpoint {
	id: string;
	second: number;
	recordType: "intermediate";
	isCompleted: boolean;
}

export interface CravingRecord {
	id: string;
	type: CravingRecordType;
	checkpointSecond: number;
	relativeSecond: number | null;
	value: number | null;
	recordedAt: string | null;
}

export interface SessionState {
	status: "created" | "running" | "paused" | "finished";
	elapsedSeconds: number;
	nextCheckpointIndex: number;
}

export interface SessionResult {
	initialCraving: number | null;
	finalCraving: number | null;
	averageIntermediateCraving: number | null;
	intermediateRecordsCompleted: number;
	totalIntermediateRecords: number;
}

export interface CueExposureSession {
	id: string;
	createdAt: string;
	startedAt: string | null;
	finishedAt: string | null;
	config: SessionConfig;
	checkpoints: SessionCheckpoint[];
	cravingRecords: CravingRecord[];
	state: SessionState;
	result: SessionResult;
}
