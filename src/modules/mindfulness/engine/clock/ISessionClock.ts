/**
 * Listener invocado cada vez que el reloj publica un cambio de tiempo o de estado.
 */
export type SessionClockListener = () => void;

/**
 * Contrato del reloj reutilizable para sesiones clinicas.
 */
export interface ISessionClock {
	start(durationMs: number): void;
	pause(): void;
	resume(): void;
	stop(): void;
	reset(): void;
	getElapsedMs(): number;
	getRemainingMs(): number;
	isRunning(): boolean;
	subscribe(listener: SessionClockListener): void;
	unsubscribe(listener: SessionClockListener): void;
}