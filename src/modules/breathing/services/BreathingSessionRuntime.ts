import type { ClinicalSessionEngine } from "../../mindfulness/engine/clinical/ClinicalSessionEngine";
import type { IStateMachine, StateMachineAction } from "../../mindfulness/engine/clinical/IStateMachine";
import type { ISessionClock } from "../../mindfulness/engine/clock/ISessionClock";
import {
	BREATHING_TIMELINE_EVENT_TYPES,
	type BreathingSessionTimeline,
	type BreathingTimelineEvent,
} from "../models/BreathingTimeline";
import type { BreathingSessionConfig } from "../models/BreathingSessionConfig";
import { TimelineCursor } from "../engine/TimelineCursor";

const BREATHING_ENGINE_STATES = {
	IDLE: "IDLE",
	READY: "READY",
	RUNNING: "RUNNING",
	PAUSED: "PAUSED",
	ASSESSMENT: "ASSESSMENT",
	FINISHED: "FINISHED",
} as const;

type BreathingEngineState = (typeof BREATHING_ENGINE_STATES)[keyof typeof BREATHING_ENGINE_STATES];

export const BREATHING_SESSION_RUNTIME_STATUSES = {
	IDLE: "IDLE",
	PREPARING: "PREPARING",
	RUNNING: "RUNNING",
	ASSESSMENT: "ASSESSMENT",
	ASSESSMENT_PAUSED: "ASSESSMENT_PAUSED",
	PAUSED: "PAUSED",
	COMPLETED: "COMPLETED",
	CANCELLED: "CANCELLED",
} as const;

export type BreathingSessionRuntimeStatus =
	(typeof BREATHING_SESSION_RUNTIME_STATUSES)[keyof typeof BREATHING_SESSION_RUNTIME_STATUSES];

export interface BreathingSessionRuntimeSnapshot {
	readonly status: BreathingSessionRuntimeStatus;
	readonly isClinicalAssessmentPaused: boolean;
	readonly startedAt: string | null;
	readonly endedAt: string | null;
	readonly timelineDurationMs: number;
	readonly currentEventIndex: number;
	readonly currentEvent: BreathingTimelineEvent | null;
}

export interface BreathingSessionRuntimeOptions {
	readonly engine: ClinicalSessionEngine<BreathingSessionConfig, never, BreathingEngineState, BreathingSessionTimeline>;
	readonly clock: ISessionClock;
}

export interface BreathingSessionRuntime {
	readonly config: BreathingSessionConfig;
	readonly clock: ISessionClock;
	readonly engine: ClinicalSessionEngine<BreathingSessionConfig, never, BreathingEngineState, BreathingSessionTimeline>;
	getSnapshot(): BreathingSessionRuntimeSnapshot;
	getTimeline(): BreathingSessionTimeline | null;
	getCurrentEvent(): BreathingTimelineEvent | null;
	subscribe(listener: () => void): void;
	unsubscribe(listener: () => void): void;
	prepareSession(): void;
	startSession(): void;
	pauseSession(): void;
	resumeSession(): void;
	pauseForAssessment(): void;
	resumeAfterAssessment(): void;
	enterAssessment(): void;
	completeSession(): void;
	cancelSession(): void;
	advanceEvent(): void;
	rewindEvent(): void;
	resetSession(): void;
	dispose(): void;
}

const BREATHING_SESSION_ACTIONS = {
	INITIALIZE: "INITIALIZE",
	START: "START",
	PAUSE: "PAUSE",
	RESUME: "RESUME",
	PAUSE_FOR_ASSESSMENT: "PAUSE_FOR_ASSESSMENT",
	ENTER_ASSESSMENT: "ENTER_ASSESSMENT",
	COMPLETE: "COMPLETE",
	CANCEL: "CANCEL",
	RESET: "RESET",
} as const;

type BreathingSessionAction = {
	type: (typeof BREATHING_SESSION_ACTIONS)[keyof typeof BREATHING_SESSION_ACTIONS];
};

const BREATHING_RUNTIME_TRANSITIONS: Record<BreathingSessionAction["type"], Partial<Record<BreathingSessionRuntimeStatus, BreathingSessionRuntimeStatus>>> = {
	[BREATHING_SESSION_ACTIONS.INITIALIZE]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.IDLE]: BREATHING_SESSION_RUNTIME_STATUSES.PREPARING,
	},
	[BREATHING_SESSION_ACTIONS.START]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.PREPARING]: BREATHING_SESSION_RUNTIME_STATUSES.RUNNING,
	},
	[BREATHING_SESSION_ACTIONS.PAUSE]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.RUNNING]: BREATHING_SESSION_RUNTIME_STATUSES.PAUSED,
	},
	[BREATHING_SESSION_ACTIONS.RESUME]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.PAUSED]: BREATHING_SESSION_RUNTIME_STATUSES.RUNNING,
		[BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT]: BREATHING_SESSION_RUNTIME_STATUSES.RUNNING,
		[BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED]: BREATHING_SESSION_RUNTIME_STATUSES.RUNNING,
	},
	[BREATHING_SESSION_ACTIONS.PAUSE_FOR_ASSESSMENT]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.RUNNING]: BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED,
	},
	[BREATHING_SESSION_ACTIONS.ENTER_ASSESSMENT]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.RUNNING]: BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT,
	},
	[BREATHING_SESSION_ACTIONS.COMPLETE]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.PREPARING]: BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED,
		[BREATHING_SESSION_RUNTIME_STATUSES.RUNNING]: BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED,
		[BREATHING_SESSION_RUNTIME_STATUSES.PAUSED]: BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED,
		[BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT]: BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED,
		[BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED]: BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED,
	},
	[BREATHING_SESSION_ACTIONS.CANCEL]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.IDLE]: BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED,
		[BREATHING_SESSION_RUNTIME_STATUSES.PREPARING]: BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED,
		[BREATHING_SESSION_RUNTIME_STATUSES.RUNNING]: BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED,
		[BREATHING_SESSION_RUNTIME_STATUSES.PAUSED]: BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED,
		[BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT]: BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED,
		[BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED]: BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED,
	},
	[BREATHING_SESSION_ACTIONS.RESET]: {
		[BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED]: BREATHING_SESSION_RUNTIME_STATUSES.IDLE,
		[BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED]: BREATHING_SESSION_RUNTIME_STATUSES.IDLE,
	},
};

class BreathingRuntimeStateMachine implements IStateMachine<BreathingSessionRuntimeStatus> {
	private state: BreathingSessionRuntimeStatus = BREATHING_SESSION_RUNTIME_STATUSES.IDLE;

	initialize(): void {
		this.state = BREATHING_SESSION_RUNTIME_STATUSES.IDLE;
	}

	dispatch(action: StateMachineAction): void {
		const nextState = BREATHING_RUNTIME_TRANSITIONS[action.type as BreathingSessionAction["type"]]?.[this.state];

		if (nextState !== undefined) {
			this.state = nextState;
		}
	}

	getState(): BreathingSessionRuntimeStatus {
		return this.state;
	}
}

class PreparedBreathingSessionRuntime implements BreathingSessionRuntime {
	readonly config: BreathingSessionConfig;
	readonly clock: ISessionClock;
	readonly engine: ClinicalSessionEngine<BreathingSessionConfig, never, BreathingEngineState, BreathingSessionTimeline>;

	private readonly listeners = new Set<() => void>();
	private readonly runtimeStateMachine = new BreathingRuntimeStateMachine();
	private readonly clockListener: () => void;
	private readonly engineListener: () => void;
	private cursor: TimelineCursor<BreathingTimelineEvent> | null = null;
	private startedAt: string | null = null;
	private endedAt: string | null = null;
	private isClinicalAssessmentPaused = false;
	private isHandlingAssessmentTransition = false;

	constructor(
		config: BreathingSessionConfig,
		clock: ISessionClock,
		engine: ClinicalSessionEngine<BreathingSessionConfig, never, BreathingEngineState, BreathingSessionTimeline>,
	) {
		this.config = config;
		this.clock = clock;
		this.engine = engine;
		this.clockListener = () => {
			this.emit();
		};
		this.engineListener = () => {
			this.syncFromEngine();
			this.emit();
		};

		this.clock.subscribe(this.clockListener);
		this.engine.subscribe(this.engineListener);
	}

	getSnapshot(): BreathingSessionRuntimeSnapshot {
		return {
			status: this.runtimeStateMachine.getState(),
			isClinicalAssessmentPaused: this.isClinicalAssessmentPaused,
			startedAt: this.startedAt,
			endedAt: this.endedAt,
			timelineDurationMs: this.engine.getTimeline()?.durationMs ?? 0,
			currentEventIndex: this.cursor?.getIndex() ?? 0,
			currentEvent: this.cursor?.current() ?? null,
		};
	}

	getTimeline(): BreathingSessionTimeline | null {
		return this.engine.getTimeline();
	}

	getCurrentEvent(): BreathingTimelineEvent | null {
		return this.cursor?.current() ?? this.engine.getCurrentEvent() ?? null;
	}

	subscribe(listener: () => void): void {
		this.listeners.add(listener);
	}

	unsubscribe(listener: () => void): void {
		this.listeners.delete(listener);
	}

	prepareSession(): void {
		if (this.runtimeStateMachine.getState() !== BREATHING_SESSION_RUNTIME_STATUSES.IDLE) {
			return;
		}

		this.engine.initialize(this.config);
		const timeline = this.engine.getTimeline();

		if (timeline !== null) {
			this.cursor = new TimelineCursor(timeline);
		}

		this.startedAt = null;
		this.endedAt = null;
		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.INITIALIZE });
		this.syncFromEngine();
		this.emit();
	}

	startSession(): void {
		if (this.runtimeStateMachine.getState() === BREATHING_SESSION_RUNTIME_STATUSES.IDLE) {
			this.prepareSession();
		}

		if (this.runtimeStateMachine.getState() !== BREATHING_SESSION_RUNTIME_STATUSES.PREPARING) {
			return;
		}

		this.startedAt ??= new Date().toISOString();
		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.START });
		this.engine.start();
		this.syncFromEngine();
		this.emit();
	}

	pauseSession(): void {
		if (this.runtimeStateMachine.getState() !== BREATHING_SESSION_RUNTIME_STATUSES.RUNNING) {
			return;
		}

		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.PAUSE });
		this.engine.pause();
		this.syncFromEngine();
		this.emit();
	}

	resumeSession(): void {
		const state = this.runtimeStateMachine.getState();

		if (
			state !== BREATHING_SESSION_RUNTIME_STATUSES.PAUSED &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED
		) {
			return;
		}

		this.isClinicalAssessmentPaused = false;
		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.RESUME });
		this.engine.continue();
		this.syncFromEngine();
		this.emit();
	}

	pauseForAssessment(): void {
		if (this.runtimeStateMachine.getState() !== BREATHING_SESSION_RUNTIME_STATUSES.RUNNING) {
			return;
		}

		this.isClinicalAssessmentPaused = true;
		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.PAUSE_FOR_ASSESSMENT });
		this.engine.pause();
		this.syncFromEngine();
		this.emit();
	}

	resumeAfterAssessment(): void {
		if (this.runtimeStateMachine.getState() !== BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED) {
			return;
		}

		this.isClinicalAssessmentPaused = false;
		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.RESUME });
		this.engine.continue();
		this.syncFromEngine();
		this.emit();
	}

	enterAssessment(): void {
		if (this.runtimeStateMachine.getState() !== BREATHING_SESSION_RUNTIME_STATUSES.RUNNING) {
			return;
		}

		this.isHandlingAssessmentTransition = true;
		try {
			this.engine.pause();
			this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.PAUSE });
			this.engine.showAssessment();
			this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.ENTER_ASSESSMENT });
			this.syncFromEngine();
			this.emit();
		} finally {
			this.isHandlingAssessmentTransition = false;
		}
	}

	completeSession(): void {
		const state = this.runtimeStateMachine.getState();

		if (
			state !== BREATHING_SESSION_RUNTIME_STATUSES.RUNNING &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.PAUSED &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.PREPARING
		) {
			return;
		}

		this.isClinicalAssessmentPaused = false;
		this.captureEndedAt();
		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.COMPLETE });
		this.engine.finish();
		this.syncFromEngine();
		this.emit();
	}

	cancelSession(): void {
		const state = this.runtimeStateMachine.getState();

		if (
			state !== BREATHING_SESSION_RUNTIME_STATUSES.IDLE &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.PREPARING &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.RUNNING &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.PAUSED &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT &&
			state !== BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED
		) {
			return;
		}

		this.isClinicalAssessmentPaused = false;
		this.captureEndedAt();
		this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.CANCEL });
		this.engine.reset();
		this.cursor = null;
		this.emit();
	}

	advanceEvent(): void {
		if (this.runtimeStateMachine.getState() === BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED) {
			return;
		}

		this.engine.advanceToNextEvent();
		this.syncFromEngine();
		this.emit();
	}

	rewindEvent(): void {
		if (this.runtimeStateMachine.getState() === BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED) {
			return;
		}

		this.engine.previousEvent();
		if (this.cursor?.hasPrevious() === true) {
			this.cursor.previous();
		}
		this.emit();
	}

	resetSession(): void {
		this.engine.reset();
		this.cursor = null;
		this.startedAt = null;
		this.endedAt = null;
		this.isClinicalAssessmentPaused = false;
		this.runtimeStateMachine.initialize();
		this.syncFromEngine();
		this.emit();
	}

	dispose(): void {
		this.clock.unsubscribe(this.clockListener);
		this.engine.unsubscribe(this.engineListener);
		this.listeners.clear();
	}

	private syncFromEngine(): void {
		const currentEvent = this.engine.getCurrentEvent();
		this.syncCursor(currentEvent);

		if (this.isHandlingAssessmentTransition) {
			return;
		}

		const engineState = this.engine.getState();

		if (engineState === BREATHING_ENGINE_STATES.FINISHED) {
			this.isClinicalAssessmentPaused = false;
			this.captureEndedAt();
			this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.COMPLETE });
			return;
		}

		if (engineState === BREATHING_ENGINE_STATES.ASSESSMENT) {
			this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.ENTER_ASSESSMENT });
			return;
		}

		if (engineState === BREATHING_ENGINE_STATES.PAUSED) {
			if (this.isClinicalAssessmentPaused) {
				this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.PAUSE_FOR_ASSESSMENT });
				return;
			}

			if (currentEvent?.type === BREATHING_TIMELINE_EVENT_TYPES.INTERMEDIATE_ASSESSMENT) {
				this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.ENTER_ASSESSMENT });
				return;
			}

			this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.PAUSE });
			return;
		}

		if (engineState === BREATHING_ENGINE_STATES.RUNNING) {
			this.isClinicalAssessmentPaused = false;
			this.runtimeStateMachine.dispatch({ type: BREATHING_SESSION_ACTIONS.START });
		}
	}

	private syncCursor(currentEvent: BreathingTimelineEvent | null): void {
		if (this.cursor === null) {
			return;
		}

		if (currentEvent === null) {
			this.cursor.reset();
			return;
		}

		if (this.cursor.current()?.id === currentEvent.id) {
			return;
		}

		this.cursor.reset();

		while (this.cursor.current() !== undefined && this.cursor.current()?.id !== currentEvent.id && this.cursor.hasNext()) {
			this.cursor.next();
		}
	}

	private captureEndedAt(): void {
		this.endedAt ??= new Date().toISOString();
	}

	private emit(): void {
		for (const listener of this.listeners) {
			listener();
		}
	}
}

export function createBreathingSessionRuntime(
	config: BreathingSessionConfig,
	options: BreathingSessionRuntimeOptions,
): BreathingSessionRuntime {
	return new PreparedBreathingSessionRuntime(
		config,
		options.clock,
		options.engine,
	);
}