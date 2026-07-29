/**
 * Minimal action contract for state-machine dispatching.
 */
export interface StateMachineAction {
	readonly type: string;
	readonly payload?: unknown;
}

/**
 * Session state machine abstraction used by the clinical coordinator.
 */
export interface IStateMachine<TState> {
	initialize(): void;
	dispatch(action: StateMachineAction): void;
	getState(): TState;
}
