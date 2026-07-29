import { ClinicalSessionEngine } from "../../mindfulness/engine/clinical/ClinicalSessionEngine";
import type { IPromptProvider } from "../../mindfulness/engine/clinical/IPromptProvider";
import type { IScheduler } from "../../mindfulness/engine/clinical/IScheduler";
import type { IStateMachine, StateMachineAction } from "../../mindfulness/engine/clinical/IStateMachine";
import { SessionClock } from "../../mindfulness/engine/clock/SessionClock";
import { TimelineCursor } from "../engine/TimelineCursor";
import type { BreathingSessionContext } from "../models/BreathingSessionContext";
import type { BreathingSessionConfig } from "../models/BreathingSessionConfig";
import {
	BREATHING_SESSION_MODES,
} from "../models/BreathingSessionConfig";
import {
	BREATHING_TIMELINE_EVENT_TYPES,
	type BreathingIntermediateAssessmentsConfig,
	type BreathingSessionTimeline,
} from "../models/BreathingTimeline";
import { BreathingTimelineBuilder } from "../engine/BreathingTimelineBuilder";
import { BreathingConductor } from "./BreathingConductor";
import { AssessmentTrigger } from "./AssessmentTrigger";
import { createBreathingSessionRuntime } from "./BreathingSessionRuntime";
import { SessionDataCollector } from "./SessionDataCollector";

export interface CreateBreathingSessionContextInput {
	readonly config: BreathingSessionConfig;
	readonly intermediateAssessmentsConfig: BreathingIntermediateAssessmentsConfig;
}

const BREATHING_ENGINE_STATES = {
	IDLE: "IDLE",
	READY: "READY",
	RUNNING: "RUNNING",
	PAUSED: "PAUSED",
	ASSESSMENT: "ASSESSMENT",
	FINISHED: "FINISHED",
} as const;

type BreathingEngineState = (typeof BREATHING_ENGINE_STATES)[keyof typeof BREATHING_ENGINE_STATES];

class EmptyBreathingPromptProvider implements IPromptProvider<BreathingSessionConfig, never> {
	getPromptSequence(config: BreathingSessionConfig): readonly never[] {
		void config;
		return [];
	}
}

class StaticBreathingScheduler
	implements IScheduler<BreathingSessionConfig, never, BreathingSessionTimeline> {
	private readonly timeline: BreathingSessionTimeline;

	constructor(timeline: BreathingSessionTimeline) {
		this.timeline = timeline;
	}

	generateTimeline(
		config: BreathingSessionConfig,
		promptSequence: readonly never[],
	): BreathingSessionTimeline {
		void config;
		void promptSequence;
		return this.timeline;
	}
}

class BreathingEngineStateMachine implements IStateMachine<BreathingEngineState> {
	private state: BreathingEngineState = BREATHING_ENGINE_STATES.IDLE;

	initialize(): void {
		this.state = BREATHING_ENGINE_STATES.IDLE;
	}

	dispatch(action: StateMachineAction): void {
		switch (action.type) {
			case "INITIALIZE":
				this.state = BREATHING_ENGINE_STATES.READY;
				return;
			case "START":
				this.state = BREATHING_ENGINE_STATES.RUNNING;
				return;
			case "PAUSE":
				this.state = BREATHING_ENGINE_STATES.PAUSED;
				return;
			case "SHOW_ASSESSMENT":
				this.state = BREATHING_ENGINE_STATES.ASSESSMENT;
				return;
			case "CONTINUE":
			case "RESUME":
				this.state = BREATHING_ENGINE_STATES.RUNNING;
				return;
			case "FINISH":
				this.state = BREATHING_ENGINE_STATES.FINISHED;
				return;
			case "RESET":
				this.state = BREATHING_ENGINE_STATES.IDLE;
				return;
			default:
				return;
		}
	}

	getState(): BreathingEngineState {
		return this.state;
	}
}

export function createBreathingSessionContext(
	input: CreateBreathingSessionContextInput,
): BreathingSessionContext {
	const timelineBuilder = new BreathingTimelineBuilder();
	const sessionDurationSeconds = input.config.durationMinutes * 60;
	const timeline = timelineBuilder.buildTimeline({
		pattern: input.config.pattern,
		sessionConfig: input.config,
		sessionDurationSeconds,
		intermediateAssessmentsConfig: input.intermediateAssessmentsConfig,
	});
	const cursor = new TimelineCursor(timeline);
	const clock = new SessionClock();
	const promptProvider = new EmptyBreathingPromptProvider();
	const scheduler = new StaticBreathingScheduler(timeline);
	const stateMachine = new BreathingEngineStateMachine();
	const engine = new ClinicalSessionEngine<
		BreathingSessionConfig,
		never,
		BreathingEngineState,
		BreathingSessionTimeline
	>(promptProvider, scheduler, clock, stateMachine, {
		isManuallyAdvancedEvent: (config, event) =>
			config.sessionMode === BREATHING_SESSION_MODES.MANUAL &&
			event.type === BREATHING_TIMELINE_EVENT_TYPES.BREATHING_CYCLE,
	});

	engine.initialize(input.config);

	const runtime = createBreathingSessionRuntime(input.config, {
		clock,
		engine,
	});
	const assessmentTrigger = new AssessmentTrigger({
		runtime,
		assessmentFrequency: input.config.assessmentFrequency,
	});
	assessmentTrigger.dispose();
	const conductor = new BreathingConductor(runtime);
	const sessionDataCollector = new SessionDataCollector({
		expediente: input.config.expediente,
		patternName: input.config.pattern.name,
		durationMinutes: input.config.durationMinutes,
		assessmentFrequency: input.config.assessmentFrequency,
		assessmentVariableKeys: input.config.assessmentVariables.map((variable) => variable.key),
		sessionMode: input.config.sessionMode,
	});

	return {
		config: input.config,
		timeline,
		cursor,
		runtime,
		assessmentTrigger,
		conductor,
		sessionDataCollector,
	};
}