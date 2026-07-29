/**
 * Abstraccion de tiempo para controlar inicio, pausa y reanudacion.
 * Implementacion pendiente.
 */
export interface ITimer {
	start(): void;
	pause(): void;
	resume(): void;
	stop(): void;
	getElapsedSeconds(): number;
}
