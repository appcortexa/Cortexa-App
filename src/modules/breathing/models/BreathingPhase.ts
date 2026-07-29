export interface BreathingPhase {
	id: string;
	key: string;
	label: string;
	durationSeconds: number | null;
	instructions?: string;
	metadata?: Record<string, unknown>;
}
