export interface IntermediateCravingRecord {
	secondFromStart: number;
	craving: number;
}

export interface SessionResult {
	patientId: string;
	startedAt: Date;
	endedAt: Date;
	durationMinutes: number;
	durationSeconds: number;
	cardAdvanceMode: "automatic" | "manual";
	intermediateRecordFrequency: "none" | "25" | "33" | "50";
	initialCraving: number;
	intermediateRecords: IntermediateCravingRecord[];
	finalCraving: number;
}
