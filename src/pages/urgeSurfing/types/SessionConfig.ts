export type IntermediateRecordFrequency = "none" | "25" | "33" | "50";

export const CARD_ADVANCE_MODES = {
	AUTOMATIC: "automatic",
	MANUAL: "manual",
} as const;

export type CardAdvanceMode = (typeof CARD_ADVANCE_MODES)[keyof typeof CARD_ADVANCE_MODES];

export interface SessionConfig {
	durationMinutes: number;
	initialCraving: number;
	intermediateRecordFrequency: IntermediateRecordFrequency;
	cardAdvanceMode: CardAdvanceMode;
}
