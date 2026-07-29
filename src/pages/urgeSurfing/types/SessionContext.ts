import type { SessionPlan } from "../engine/SessionPlanner";
import type { SessionConfig } from "./SessionConfig";

export interface UrgeSurfingSessionContext {
	expediente: string;
	sessionConfig: SessionConfig;
	sessionPlan: SessionPlan;
	cardAdvanceMode: SessionConfig["cardAdvanceMode"];
}

export interface UrgeSurfingPreparationState {
	expediente: string;
	durationMinutes: number;
	intermediateRecordFrequency: SessionConfig["intermediateRecordFrequency"];
	cardAdvanceMode: SessionConfig["cardAdvanceMode"];
}