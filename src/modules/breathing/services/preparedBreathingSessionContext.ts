import type { BreathingSessionContext } from "../models/BreathingSessionContext";

let preparedBreathingSessionContext: BreathingSessionContext | null = null;

export function prepareBreathingSessionContext(context: BreathingSessionContext): BreathingSessionContext {
	preparedBreathingSessionContext = context;
	return context;
}

export function getPreparedBreathingSessionContext(): BreathingSessionContext | null {
	return preparedBreathingSessionContext;
}

export function resetPreparedBreathingSessionContext(): void {
	preparedBreathingSessionContext = null;
}
