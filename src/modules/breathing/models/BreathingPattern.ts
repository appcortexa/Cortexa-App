import type { BreathingPhase } from "./BreathingPhase";

export interface BreathingPattern {
	id: string;
	key: string;
	name: string;
	description?: string;
	phases: readonly BreathingPhase[];
	totalCycleSeconds: number | null;
	allowsCustomization: boolean;
	metadata?: Record<string, unknown>;
}
