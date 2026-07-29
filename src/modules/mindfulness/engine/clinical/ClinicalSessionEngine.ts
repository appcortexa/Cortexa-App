import type { IPromptProvider } from "./IPromptProvider";
import type { ClinicalTimeline, IScheduler } from "./IScheduler";
import type { IStateMachine, StateMachineAction } from "./IStateMachine";
import type { ISessionClock } from "../clock/ISessionClock";
import type { Timeline } from "../timeline/Timeline";
import { TimelineCursor } from "../timeline/TimelineCursor";

const CLINICAL_ACTIONS = {
	INITIALIZE: "INITIALIZE",
	START: "START",
	PAUSE: "PAUSE",
	RESUME: "RESUME",
	SHOW_ASSESSMENT: "SHOW_ASSESSMENT",
	CONTINUE: "CONTINUE",
	FINISH: "FINISH",
	RESET: "RESET",
} as const;

type ClinicalActionType = (typeof CLINICAL_ACTIONS)[keyof typeof CLINICAL_ACTIONS];

type ClinicalAction = Readonly<{
	type: ClinicalActionType;
}>;

type TimelineCursorAdapter<TEvent> = {
	current(): TEvent | undefined;
	next(): TEvent | undefined;
	previous(): TEvent | undefined;
	peekPrevious(): TEvent | undefined;
	peekNext(): TEvent | undefined;
	isFinished(): boolean;
	reset(): void;
};

export type ClinicalSessionListener = () => void;

type ClinicalSessionEngineOptions<TConfig, TEvent> = {
	isManuallyAdvancedEvent?: (config: TConfig, event: TEvent) => boolean;
};

/**
 * Generic coordinator for clinical sessions.
 *
 * This engine does not run timers, does not auto-advance events,
 * and does not include clinical decision logic.
 */
export class ClinicalSessionEngine<
	TConfig,
	TPrompt,
	TState,
	TTimeline extends ClinicalTimeline = ClinicalTimeline,
> {
	private readonly promptProvider: IPromptProvider<TConfig, TPrompt>;
	private readonly scheduler: IScheduler<TConfig, TPrompt, TTimeline>;
	private readonly sessionClock: ISessionClock;
	private readonly stateMachine: IStateMachine<TState>;
	private readonly clockListener: () => void;
	private readonly isManuallyAdvancedEvent: (config: TConfig, event: TTimeline["timelineEvents"][number]) => boolean;

	private config: TConfig | null = null;
	private promptSequence: readonly TPrompt[] = [];
	private timeline: TTimeline | null = null;
	private timelineCursor: TimelineCursorAdapter<TTimeline["timelineEvents"][number]> | null = null;
	private manualEventCursor: TimelineCursorAdapter<TTimeline["timelineEvents"][number]> | null = null;
	private presentedEvent: TTimeline["timelineEvents"][number] | null = null;
	private lastPresentedManualEvent: TTimeline["timelineEvents"][number] | null = null;
	private suppressClockNotifications = false;
	private lastObservedElapsedMs = -1;
	private readonly listeners = new Set<ClinicalSessionListener>();

	constructor(
		promptProvider: IPromptProvider<TConfig, TPrompt>,
		scheduler: IScheduler<TConfig, TPrompt, TTimeline>,
		sessionClock: ISessionClock,
		stateMachine: IStateMachine<TState>,
		options: ClinicalSessionEngineOptions<TConfig, TTimeline["timelineEvents"][number]> = {},
	) {
		this.promptProvider = promptProvider;
		this.scheduler = scheduler;
		this.sessionClock = sessionClock;
		this.stateMachine = stateMachine;
		this.isManuallyAdvancedEvent = options.isManuallyAdvancedEvent ?? (() => false);
		this.clockListener = () => {
			this.handleClockTick();
		};
		this.sessionClock.subscribe(this.clockListener);
	}

	initialize(config: TConfig): void {
		this.config = config;
		this.promptSequence = this.promptProvider.getPromptSequence(config);
		this.timeline = this.scheduler.generateTimeline(config, this.promptSequence);
		this.timelineCursor = this.createTimelineCursor(this.timeline);
		this.manualEventCursor = this.createTimelineCursor(this.timeline);
		this.presentedEvent = this.timelineCursor.current() ?? null;
		this.lastPresentedManualEvent = null;
		this.presentInitialManualEvent();
		this.lastObservedElapsedMs = -1;

		this.suppressClockNotifications = true;
		this.sessionClock.reset();
		this.suppressClockNotifications = false;

		this.stateMachine.initialize();
		this.dispatch(CLINICAL_ACTIONS.INITIALIZE);
		this.notify();
	}

	start(): void {
		this.dispatch(CLINICAL_ACTIONS.START);

		if (this.timeline === null) {
			return;
		}

		this.lastObservedElapsedMs = -1;
		this.sessionClock.start(this.timeline.durationMs);
		this.notify();
	}

	pause(): void {
		this.sessionClock.pause();
		this.dispatch(CLINICAL_ACTIONS.PAUSE);
		this.notify();
	}

	resume(): void {
		this.sessionClock.resume();
		this.dispatch(CLINICAL_ACTIONS.RESUME);
		this.notify();
	}

	showAssessment(): void {
		this.dispatch(CLINICAL_ACTIONS.SHOW_ASSESSMENT);
		this.notify();
	}

	continue(): void {
		this.dispatch(CLINICAL_ACTIONS.CONTINUE);
		if (this.lastPresentedManualEvent !== null) {
			this.presentedEvent = this.lastPresentedManualEvent;
		}
		this.sessionClock.resume();
		this.notify();
	}

	finish(): void {
		this.sessionClock.stop();
		this.dispatch(CLINICAL_ACTIONS.FINISH);
		this.notify();
	}

	reset(): void {
		this.suppressClockNotifications = true;
		this.sessionClock.stop();
		this.sessionClock.reset();
		this.suppressClockNotifications = false;

		this.config = null;
		this.promptSequence = [];
		this.timeline = null;
		this.timelineCursor = null;
		this.manualEventCursor = null;
		this.presentedEvent = null;
		this.lastPresentedManualEvent = null;
		this.lastObservedElapsedMs = -1;

		this.stateMachine.initialize();
		this.notify();
	}

	subscribe(listener: ClinicalSessionListener): void {
		this.listeners.add(listener);
	}

	unsubscribe(listener: ClinicalSessionListener): void {
		this.listeners.delete(listener);
	}

	getState(): TState {
		return this.stateMachine.getState();
	}

	getTimeline(): TTimeline | null {
		if (this.config === null) {
			return null;
		}

		return this.timeline;
	}

	getCurrentEvent(): TTimeline["timelineEvents"][number] | null {
		if (this.config === null || this.timelineCursor === null) {
			return null;
		}

		return this.presentedEvent ?? this.timelineCursor.current() ?? null;
	}

	advanceToNextEvent(): void {
		if (this.config === null || this.timelineCursor === null) {
			return;
		}

		if (this.manualEventCursor !== null && this.hasManualEvents()) {
			this.advanceToNextManualEvent();
			return;
		}

		this.advanceAndProcessNextEvent();
	}

	previousEvent(): TTimeline["timelineEvents"][number] | null {
		if (this.config === null || this.timelineCursor === null) {
			return null;
		}

		return this.timelineCursor.previous() ?? null;
	}

	getPreviousEvent(): TTimeline["timelineEvents"][number] | null {
		if (this.config === null || this.timelineCursor === null) {
			return null;
		}

		return this.timelineCursor.peekPrevious() ?? null;
	}

	isLastEvent(): boolean {
		if (this.config === null || this.timelineCursor === null) {
			return false;
		}

		return this.timelineCursor.isFinished();
	}

	resetTimeline(): void {
		if (this.timeline === null) {
			this.timelineCursor = null;
			this.manualEventCursor = null;
			this.presentedEvent = null;
			this.lastPresentedManualEvent = null;
			this.lastObservedElapsedMs = -1;
			return;
		}

		if (this.timelineCursor === null) {
			this.timelineCursor = this.createTimelineCursor(this.timeline);
			this.manualEventCursor = this.createTimelineCursor(this.timeline);
			this.presentedEvent = this.timelineCursor.current() ?? null;
			this.lastPresentedManualEvent = null;
			this.presentInitialManualEvent();
			this.lastObservedElapsedMs = -1;
			return;
		}

		this.timelineCursor.reset();
		this.manualEventCursor = this.createTimelineCursor(this.timeline);
		this.presentedEvent = this.timelineCursor.current() ?? null;
		this.lastPresentedManualEvent = null;
		this.presentInitialManualEvent();
		this.lastObservedElapsedMs = -1;
	}

	private createTimelineCursor(
		timeline: TTimeline,
	): TimelineCursorAdapter<TTimeline["timelineEvents"][number]> {
		const cursorTimeline = {
			timelineEvents: [...timeline.timelineEvents],
			durationMs: timeline.durationMs,
		} as Timeline;

		return new TimelineCursor(cursorTimeline) as TimelineCursorAdapter<TTimeline["timelineEvents"][number]>;
	}

	private handleClockTick(): void {
		if (this.suppressClockNotifications) {
			return;
		}

		if (this.timeline === null || this.timelineCursor === null) {
			return;
		}

		const elapsedMs = this.sessionClock.getElapsedMs();

		if (elapsedMs < this.lastObservedElapsedMs) {
			this.lastObservedElapsedMs = elapsedMs;
		}

		if (elapsedMs === this.lastObservedElapsedMs) {
			return;
		}

		this.lastObservedElapsedMs = elapsedMs;

		while (true) {
			const nextEvent = this.timelineCursor.peekNext();

			if (nextEvent === undefined || elapsedMs < nextEvent.timestampMs) {
				this.notify();
				return;
			}

			if (this.advanceAndProcessNextEvent()) {
				return;
			}
		}
	}

	private advanceAndProcessNextEvent(): boolean {
		if (this.timelineCursor === null || this.timelineCursor.peekNext() === undefined) {
			this.notify();
			return true;
		}

		const currentEvent = this.timelineCursor.next();

		if (currentEvent !== undefined && this.config !== null && this.isManuallyAdvancedEvent(this.config, currentEvent)) {
			return false;
		}

		if (currentEvent !== undefined) {
			this.presentedEvent = currentEvent;
		}

		if (currentEvent?.type === "ASSESSMENT") {
			this.sessionClock.pause();
			this.dispatch(CLINICAL_ACTIONS.SHOW_ASSESSMENT);
			this.notify();
			return true;
		}

		if (currentEvent?.type === "END") {
			this.finish();
			return true;
		}

		this.notify();
		return false;
	}

	private hasManualEvents(): boolean {
		if (this.config === null || this.timeline === null) {
			return false;
		}

		return this.timeline.timelineEvents.some((event) => this.isManuallyAdvancedEvent(this.config as TConfig, event));
	}

	private presentInitialManualEvent(): void {
		if (this.manualEventCursor === null || !this.hasManualEvents()) {
			return;
		}

		this.advanceToNextManualEvent(false);
	}

	private advanceToNextManualEvent(notify = true): void {
		if (this.manualEventCursor === null || this.config === null) {
			return;
		}

		while (this.manualEventCursor.peekNext() !== undefined) {
			const event = this.manualEventCursor.next();

			if (event === undefined || !this.isManuallyAdvancedEvent(this.config, event)) {
				continue;
			}

			this.presentedEvent = event;
			this.lastPresentedManualEvent = event;
			if (notify) {
				this.notify();
			}
			return;
		}

		if (notify) {
			this.notify();
		}
	}

	private dispatch(type: ClinicalActionType): void {
		const action: ClinicalAction = { type };
		this.stateMachine.dispatch(action satisfies StateMachineAction);
	}

	private notify(): void {
		for (const listener of this.listeners) {
			listener();
		}
	}
}
