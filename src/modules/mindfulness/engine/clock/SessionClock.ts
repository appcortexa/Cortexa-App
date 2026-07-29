import type { ISessionClock, SessionClockListener } from "./ISessionClock";

const DEFAULT_TICK_INTERVAL_MS = 250;

/**
 * Reloj de sesion reutilizable.
 *
 * Mide el tiempo transcurrido, publica cambios periodicos a listeners y no
 * toma decisiones de dominio ni avanza eventos por si mismo.
 */
export class SessionClock implements ISessionClock {
	private durationMs = 0;
	private accumulatedElapsedMs = 0;
	private currentRunStartedAtMs = 0;
	private running = false;
	private paused = false;
	private tickId: ReturnType<typeof setInterval> | null = null;
	private readonly listeners = new Set<SessionClockListener>();

	start(durationMs: number): void {
		this.clearTick();

		this.durationMs = Math.max(0, durationMs);
		this.accumulatedElapsedMs = 0;
		this.currentRunStartedAtMs = this.nowMs();
		this.running = this.durationMs > 0;
		this.paused = false;

		if (!this.running) {
			this.emit();
			return;
		}

		this.startTicking();
		this.emit();
	}

	pause(): void {
		if (!this.running || this.paused) {
			return;
		}

		this.accumulatedElapsedMs = this.getElapsedMs();
		this.running = false;
		this.paused = true;
		this.currentRunStartedAtMs = 0;
		this.clearTick();
		this.emit();
	}

	resume(): void {
		if (!this.paused) {
			return;
		}

		if (this.getRemainingMs() <= 0) {
			this.running = false;
			this.paused = false;
			this.emit();
			return;
		}

		this.currentRunStartedAtMs = this.nowMs();
		this.running = true;
		this.paused = false;
		this.startTicking();
		this.emit();
	}

	stop(): void {
		if (!this.running && !this.paused) {
			return;
		}

		if (this.running) {
			this.accumulatedElapsedMs = this.getElapsedMs();
		}

		this.running = false;
		this.paused = false;
		this.currentRunStartedAtMs = 0;
		this.clearTick();
		this.emit();
	}

	reset(): void {
		this.clearTick();
		this.durationMs = 0;
		this.accumulatedElapsedMs = 0;
		this.currentRunStartedAtMs = 0;
		this.running = false;
		this.paused = false;
		this.emit();
	}

	getElapsedMs(): number {
		if (!this.running) {
			return this.accumulatedElapsedMs;
		}

		const elapsedMs = this.accumulatedElapsedMs + (this.nowMs() - this.currentRunStartedAtMs);
		return Math.min(this.durationMs, Math.max(0, elapsedMs));
	}

	getRemainingMs(): number {
		return Math.max(0, this.durationMs - this.getElapsedMs());
	}

	isRunning(): boolean {
		return this.running;
	}

	subscribe(listener: SessionClockListener): void {
		this.listeners.add(listener);
	}

	unsubscribe(listener: SessionClockListener): void {
		this.listeners.delete(listener);
	}

	private startTicking(): void {
		this.clearTick();
		this.tickId = setInterval(() => {
			this.tick();
		}, DEFAULT_TICK_INTERVAL_MS);
	}

	private tick(): void {
		if (!this.running) {
			return;
		}

		if (this.getRemainingMs() <= 0) {
			this.accumulatedElapsedMs = this.durationMs;
			this.running = false;
			this.paused = false;
			this.currentRunStartedAtMs = 0;
			this.clearTick();
			this.emit();
			return;
		}

		this.emit();
	}

	private emit(): void {
		for (const listener of this.listeners) {
			try {
				listener();
			} catch {
				// Un listener no debe interrumpir la publicacion de tiempo para los demas.
			}
		}
	}

	private clearTick(): void {
		if (this.tickId !== null) {
			clearInterval(this.tickId);
			this.tickId = null;
		}
	}

	private nowMs(): number {
		if (typeof performance !== "undefined" && typeof performance.now === "function") {
			return performance.now();
		}

		return Date.now();
	}
}