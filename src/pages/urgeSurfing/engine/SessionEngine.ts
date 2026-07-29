import type { SessionTimeline, SessionTimelineEvent } from "../types/SessionTimeline";

export const SESSION_ENGINE_STATUS = {
	IDLE: "IDLE",
	RUNNING: "RUNNING",
	PAUSED: "PAUSED",
	STOPPED: "STOPPED",
	FINISHED: "FINISHED",
	DISPOSED: "DISPOSED",
} as const;

export type SessionEngineStatus = (typeof SESSION_ENGINE_STATUS)[keyof typeof SESSION_ENGINE_STATUS];

export interface SessionFinishPayload {
	reason: "timeline-complete" | "stopped";
	elapsedSeconds: number;
	totalDurationSeconds: number;
}

export interface SessionTickPayload {
	elapsedSeconds: number;
	totalDurationSeconds: number;
}

export interface ISessionEngine {
	start(): void;
	pause(): void;
	resume(): void;
	stop(): void;
	dispose(): void;

	onTick(callback: (payload: SessionTickPayload) => void): () => void;
	onTimelineEvent(callback: (event: SessionTimelineEvent) => void): () => void;
	onFinish(callback: (payload: SessionFinishPayload) => void): () => void;

	getStatus(): SessionEngineStatus;
	getElapsedSeconds(): number;
	getTotalDurationSeconds(): number;
}

/**
 * SessionEngine ejecuta un SessionTimeline ya planificado.
 *
 * No calcula tarjetas, no calcula duraciones y no modifica el timeline.
 * Solo avanza el tiempo y emite los eventos predefinidos para cada segundo.
 */
export class SessionEngine implements ISessionEngine {
	private readonly eventsBySecond = new Map<number, SessionTimelineEvent[]>();
	private readonly totalDurationSeconds: number;

	private intervalId: ReturnType<typeof setInterval> | null = null;
	private elapsedSeconds = 0;
	private status: SessionEngineStatus = SESSION_ENGINE_STATUS.IDLE;
	private hasFinished = false;

	private readonly tickListeners = new Set<(payload: SessionTickPayload) => void>();
	private readonly timelineEventListeners = new Set<(event: SessionTimelineEvent) => void>();
	private readonly finishListeners = new Set<(payload: SessionFinishPayload) => void>();

	constructor(timeline: SessionTimeline) {
		this.totalDurationSeconds = timeline.reduce((maxSecond, event) => Math.max(maxSecond, event.second), 0);

		for (const event of timeline) {
			const secondEvents = this.eventsBySecond.get(event.second) ?? [];
			secondEvents.push(event);
			this.eventsBySecond.set(event.second, secondEvents);
		}
	}

	start(): void {
		this.ensureNotDisposed();

		if (this.status === SESSION_ENGINE_STATUS.RUNNING) {
			return;
		}

		this.clearInterval();
		this.elapsedSeconds = 0;
		this.hasFinished = false;
		this.status = SESSION_ENGINE_STATUS.RUNNING;

		this.emitTick();
		this.emitTimelineEventsForCurrentSecond();
		this.checkCompletion();

		if (this.status === SESSION_ENGINE_STATUS.RUNNING) {
			this.intervalId = setInterval(() => {
				this.handleTick();
			}, 1000);
		}
	}

	pause(): void {
		this.ensureNotDisposed();

		if (this.status !== SESSION_ENGINE_STATUS.RUNNING) {
			return;
		}

		this.clearInterval();
		this.status = SESSION_ENGINE_STATUS.PAUSED;
	}

	resume(): void {
		this.ensureNotDisposed();

		if (this.status !== SESSION_ENGINE_STATUS.PAUSED || this.hasFinished) {
			return;
		}

		this.status = SESSION_ENGINE_STATUS.RUNNING;
		this.intervalId = setInterval(() => {
			this.handleTick();
		}, 1000);
	}

	stop(): void {
		this.ensureNotDisposed();

		if (this.hasFinished || this.status === SESSION_ENGINE_STATUS.STOPPED) {
			return;
		}

		this.clearInterval();
		this.hasFinished = true;
		this.status = SESSION_ENGINE_STATUS.STOPPED;
		this.emitFinish({
			reason: "stopped",
			elapsedSeconds: this.elapsedSeconds,
			totalDurationSeconds: this.totalDurationSeconds,
		});
	}

	dispose(): void {
		if (this.status === SESSION_ENGINE_STATUS.DISPOSED) {
			return;
		}

		this.clearInterval();
		this.tickListeners.clear();
		this.timelineEventListeners.clear();
		this.finishListeners.clear();
		this.status = SESSION_ENGINE_STATUS.DISPOSED;
	}

	onTick(callback: (payload: SessionTickPayload) => void): () => void {
		this.ensureNotDisposed();
		this.tickListeners.add(callback);

		return () => {
			this.tickListeners.delete(callback);
		};
	}

	onTimelineEvent(callback: (event: SessionTimelineEvent) => void): () => void {
		this.ensureNotDisposed();
		this.timelineEventListeners.add(callback);

		return () => {
			this.timelineEventListeners.delete(callback);
		};
	}

	onFinish(callback: (payload: SessionFinishPayload) => void): () => void {
		this.ensureNotDisposed();
		this.finishListeners.add(callback);

		return () => {
			this.finishListeners.delete(callback);
		};
	}

	getStatus(): SessionEngineStatus {
		return this.status;
	}

	getElapsedSeconds(): number {
		return this.elapsedSeconds;
	}

	getTotalDurationSeconds(): number {
		return this.totalDurationSeconds;
	}

	private handleTick(): void {
		if (this.status !== SESSION_ENGINE_STATUS.RUNNING || this.hasFinished) {
			return;
		}

		this.elapsedSeconds += 1;
		this.emitTick();
		this.emitTimelineEventsForCurrentSecond();
		this.checkCompletion();
	}

	private emitTick(): void {
		const payload: SessionTickPayload = {
			elapsedSeconds: this.elapsedSeconds,
			totalDurationSeconds: this.totalDurationSeconds,
		};

		for (const listener of this.tickListeners) {
			listener(payload);
		}
	}

	private emitTimelineEventsForCurrentSecond(): void {
		const events = this.eventsBySecond.get(this.elapsedSeconds) ?? [];

		for (const event of events) {
			if (event.second >= this.totalDurationSeconds) {
				this.hasFinished = true;
			}

			for (const listener of this.timelineEventListeners) {
				listener(event);
			}
		}
	}

	private checkCompletion(): void {
		if (!this.hasFinished && this.elapsedSeconds < this.totalDurationSeconds) {
			return;
		}

		if (this.status !== SESSION_ENGINE_STATUS.RUNNING) {
			return;
		}

		this.clearInterval();
		this.hasFinished = true;
		this.status = SESSION_ENGINE_STATUS.FINISHED;
		this.emitFinish({
			reason: "timeline-complete",
			elapsedSeconds: this.elapsedSeconds,
			totalDurationSeconds: this.totalDurationSeconds,
		});
	}

	private emitFinish(payload: SessionFinishPayload): void {
		for (const listener of this.finishListeners) {
			listener(payload);
		}
	}

	private ensureNotDisposed(): void {
		if (this.status === SESSION_ENGINE_STATUS.DISPOSED) {
			throw new Error("SessionEngine fue liberado y no puede reutilizarse.");
		}
	}

	private clearInterval(): void {
		if (this.intervalId === null) {
			return;
		}

		clearInterval(this.intervalId);
		this.intervalId = null;
	}
}
