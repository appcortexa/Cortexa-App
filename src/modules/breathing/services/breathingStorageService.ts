import type { BreathingSessionSummaryViewModel } from "../models/BreathingSessionSummaryViewModel";
import { BreathingSessionPersistenceMapper } from "./BreathingSessionPersistenceMapper";
import type { BreathingSessionCollectedData } from "./SessionDataCollector";

const BREATHING_STORAGE_KEY = "reconecta_breathing_sessions_v1";

/**
 * Public contract for breathing-session persistence.
 * Implementation is intentionally deferred to a later stage.
 */
export interface BreathingStoredSession {
	sessionId: string;
	expediente: string;
	summary: BreathingSessionSummaryViewModel;
	collectedData: BreathingSessionCollectedData;
}

export interface SaveBreathingSessionInput {
	sessionId: string;
	expediente: string;
	summary: BreathingSessionSummaryViewModel;
	collectedData: BreathingSessionCollectedData;
}

interface BreathingStoredSessionRecord {
	sessionId: string;
	expediente: string;
	summary: ReturnType<typeof BreathingSessionPersistenceMapper.toStorageRecord>;
	collectedData: BreathingSessionCollectedData;
}

function canUseLocalStorage(): boolean {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneAssessment(
	assessment: BreathingSessionCollectedData["initialAssessment"],
): BreathingSessionCollectedData["initialAssessment"] {
	if (assessment === null) {
		return null;
	}

	return {
		recordedAt: assessment.recordedAt,
		values: assessment.values.map((value) => ({
			variableKey: value.variableKey,
			value: value.value,
		})),
	};
}

function cloneIntermediateAssessments(
	assessments: BreathingSessionCollectedData["intermediateAssessments"],
): BreathingSessionCollectedData["intermediateAssessments"] {
	return assessments.map((assessment) => ({
		assessmentEventId: assessment.assessmentEventId,
		recordedAt: assessment.recordedAt,
		values: assessment.values.map((value) => ({
			variableKey: value.variableKey,
			value: value.value,
		})),
	}));
}

function cloneCollectedData(
	collectedData: BreathingSessionCollectedData,
): BreathingSessionCollectedData {
	return {
		metadata: {
			...collectedData.metadata,
			assessmentVariableKeys: [...collectedData.metadata.assessmentVariableKeys],
		},
		initialAssessment: cloneAssessment(collectedData.initialAssessment),
		intermediateAssessments: cloneIntermediateAssessments(collectedData.intermediateAssessments),
		finalAssessment: cloneAssessment(collectedData.finalAssessment),
		timestamps: {
			createdAt: collectedData.timestamps.createdAt,
			updatedAt: collectedData.timestamps.updatedAt,
			sessionStartedAt: collectedData.timestamps.sessionStartedAt,
			sessionFinishedAt: collectedData.timestamps.sessionFinishedAt,
			initialAssessmentAt: collectedData.timestamps.initialAssessmentAt,
			intermediateAssessmentAt: [...collectedData.timestamps.intermediateAssessmentAt],
			finalAssessmentAt: collectedData.timestamps.finalAssessmentAt,
		},
	};
}

function toStoredSession(record: BreathingStoredSessionRecord): BreathingStoredSession {
	return {
		sessionId: record.sessionId,
		expediente: record.expediente,
		summary: BreathingSessionPersistenceMapper.toSummaryViewModel(record.summary),
		collectedData: cloneCollectedData(record.collectedData),
	};
}

function toStoredSessionRecord(input: SaveBreathingSessionInput): BreathingStoredSessionRecord {
	return {
		sessionId: input.sessionId,
		expediente: input.expediente.trim(),
		summary: BreathingSessionPersistenceMapper.toStorageRecord(input.summary),
		collectedData: cloneCollectedData(input.collectedData),
	};
}

function readStoredBreathingSessions(): BreathingStoredSessionRecord[] {
	if (!canUseLocalStorage()) {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(BREATHING_STORAGE_KEY);
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed
			.filter((record): record is BreathingStoredSessionRecord => {
				if (!record || typeof record !== "object") {
					return false;
				}

				const candidate = record as Partial<BreathingStoredSessionRecord>;
				return (
					typeof candidate.sessionId === "string" &&
					typeof candidate.expediente === "string" &&
					candidate.summary !== undefined &&
					candidate.collectedData !== undefined
				);
			})
			.map((record) => ({
				sessionId: record.sessionId,
				expediente: record.expediente,
				summary: BreathingSessionPersistenceMapper.toStorageRecord(
					BreathingSessionPersistenceMapper.toSummaryViewModel(record.summary),
				),
				collectedData: cloneCollectedData(record.collectedData),
			}));
	} catch {
		return [];
	}
}

function writeStoredBreathingSessions(results: BreathingStoredSessionRecord[]): void {
	if (!canUseLocalStorage()) {
		return;
	}

	window.localStorage.setItem(BREATHING_STORAGE_KEY, JSON.stringify(results));
}

export interface IBreathingStorageService {
	saveSession(input: SaveBreathingSessionInput): BreathingStoredSession;
	getSession(sessionId: string): BreathingStoredSession | null;
	getSessionsByExpediente(expediente: string): BreathingStoredSession[];
	deleteSession(sessionId: string): void;
}

export class BreathingStorageService implements IBreathingStorageService {
	saveSession(input: SaveBreathingSessionInput): BreathingStoredSession {
		const record = toStoredSessionRecord(input);
		const currentSessions = readStoredBreathingSessions().filter(
			(session) => session.sessionId !== record.sessionId,
		);
		const updatedSessions = [record, ...currentSessions];

		writeStoredBreathingSessions(updatedSessions);

		return toStoredSession(record);
	}

	getSession(sessionId: string): BreathingStoredSession | null {
		const normalizedSessionId = sessionId.trim();
		if (!normalizedSessionId) {
			return null;
		}

		const record = readStoredBreathingSessions().find(
			(session) => session.sessionId === normalizedSessionId,
		);

		return record ? toStoredSession(record) : null;
	}

	getSessionsByExpediente(expediente: string): BreathingStoredSession[] {
		const normalized = expediente.trim().toLowerCase();
		if (!normalized) {
			return [];
		}

		return readStoredBreathingSessions()
			.filter((session) => session.expediente.trim().toLowerCase() === normalized)
			.map((session) => toStoredSession(session));
	}

	deleteSession(sessionId: string): void {
		void sessionId;
		throw new Error("BreathingStorageService.deleteSession is not implemented yet.");
	}
}

export const breathingStorageService = new BreathingStorageService();
