import type { MindfulnessSessionConfig } from "../models/MindfulnessSessionConfig";
import type { MindfulnessPromptViewModel } from "../models/MindfulnessPromptViewModel";
import type { SessionAction } from "../engine/state/SessionAction";
import { SESSION_STATES, type SessionState } from "../engine/state/SessionState";
import { sessionReducer } from "../engine/state/SessionReducer";
import { createTimeline } from "../engine/Scheduler";
import { TimelineEventType } from "../engine/timeline/TimelineEvent";
import { ClinicalSessionEngine } from "../engine/clinical/ClinicalSessionEngine";
import type { IStateMachine } from "../engine/clinical/IStateMachine";
import type { IPromptProvider } from "../engine/clinical/IPromptProvider";
import type { IScheduler } from "../engine/clinical/IScheduler";
import { getPromptSequence } from "../engine/prompts/PromptRegistry";
import type { PromptCard } from "../engine/prompts/PromptCard";
import { SessionClock } from "../engine/clock/SessionClock";
import type { Timeline } from "../engine/timeline/Timeline";
import type {
	MindfulnessAssessmentSnapshot,
	MindfulnessIntermediateAssessment,
	MindfulnessAssessmentValue,
	PendingMindfulnessAssessment,
} from "../models/MindfulnessAssessment";
import type {
	MindfulnessSessionIntermediateAssessmentViewModel,
	MindfulnessSessionSummaryFieldViewModel,
	MindfulnessSessionSummaryValueViewModel,
	MindfulnessSessionSummaryViewModel,
} from "../models/MindfulnessSessionSummaryViewModel";
import { ASSESSMENT_VARIABLE_LABELS, SESSION_MODES } from "../models/mindfulness.models";

type MindfulnessEngine = ClinicalSessionEngine<MindfulnessSessionConfig, PromptCard, SessionState, Timeline>;

type RuntimeListener = () => void;

export interface MindfulnessSessionRuntime {
	config: MindfulnessSessionConfig;
	clock: SessionClock;
	engine: MindfulnessEngine;
	promptSequence: readonly PromptCard[];
	startedAt: string | null;
	finishedAt: string | null;
	initialAssessment: MindfulnessAssessmentSnapshot | null;
	finalAssessment: MindfulnessAssessmentSnapshot | null;
	pendingAssessment: PendingMindfulnessAssessment | null;
	intermediateAssessments: readonly MindfulnessIntermediateAssessment[];
	subscribe(listener: RuntimeListener): void;
	unsubscribe(listener: RuntimeListener): void;
	startSession(): void;
	pauseSession(): void;
	resumeSession(): void;
	nextPrompt(): void;
	finishSession(): void;
	submitInitialAssessment(values: readonly MindfulnessAssessmentValue[]): void;
	submitAssessment(values: readonly MindfulnessAssessmentValue[]): void;
	submitFinalAssessment(values: readonly MindfulnessAssessmentValue[]): void;
	dispose(): void;
}

class MindfulnessPromptProvider implements IPromptProvider<MindfulnessSessionConfig, PromptCard> {
	getPromptSequence(config: MindfulnessSessionConfig): readonly PromptCard[] {
		return getPromptSequence(config.practice);
	}
}

class MindfulnessScheduler implements IScheduler<MindfulnessSessionConfig, PromptCard, Timeline> {
	generateTimeline(config: MindfulnessSessionConfig, promptSequence: readonly PromptCard[]): Timeline {
		return createTimeline({
			practice: config.practice,
			durationMinutes: config.durationMinutes,
			assessmentFrequency: config.assessmentFrequency,
			promptSequence,
		});
	}
}

class MindfulnessStateMachine implements IStateMachine<SessionState> {
	private state: SessionState = SESSION_STATES.IDLE;

	initialize(): void {
		this.state = SESSION_STATES.IDLE;
	}

	dispatch(action: SessionAction): void {
		this.state = sessionReducer(this.state, action);
	}

	getState(): SessionState {
		return this.state;
	}
}

class PreparedMindfulnessSessionRuntime implements MindfulnessSessionRuntime {
	readonly config: MindfulnessSessionConfig;
	readonly clock: SessionClock;
	readonly engine: MindfulnessEngine;
	readonly promptSequence: readonly PromptCard[];

	private readonly listeners = new Set<RuntimeListener>();
	private readonly clockListener: () => void;
	private readonly engineListener: () => void;
	private startedAtState: string | null = null;
	private finishedAtState: string | null = null;
	private initialAssessmentState: MindfulnessAssessmentSnapshot | null = null;
	private finalAssessmentState: MindfulnessAssessmentSnapshot | null = null;
	private pendingAssessmentState: PendingMindfulnessAssessment | null = null;
	private readonly intermediateAssessmentState: MindfulnessIntermediateAssessment[] = [];

	constructor(
		config: MindfulnessSessionConfig,
		clock: SessionClock,
		engine: MindfulnessEngine,
		promptSequence: readonly PromptCard[],
	) {
		this.config = config;
		this.clock = clock;
		this.engine = engine;
		this.promptSequence = promptSequence;
		this.clockListener = () => {
			this.emit();
		};
		this.engineListener = () => {
			this.syncAssessmentState();
			this.emit();
		};

		this.clock.subscribe(this.clockListener);
		this.engine.subscribe(this.engineListener);
		this.syncAssessmentState();
	}

	get pendingAssessment(): PendingMindfulnessAssessment | null {
		return this.pendingAssessmentState;
	}

	get startedAt(): string | null {
		return this.startedAtState;
	}

	get finishedAt(): string | null {
		return this.finishedAtState;
	}

	get initialAssessment(): MindfulnessAssessmentSnapshot | null {
		return this.initialAssessmentState;
	}

	get finalAssessment(): MindfulnessAssessmentSnapshot | null {
		return this.finalAssessmentState;
	}

	get intermediateAssessments(): readonly MindfulnessIntermediateAssessment[] {
		return this.intermediateAssessmentState;
	}

	subscribe(listener: RuntimeListener): void {
		this.listeners.add(listener);
	}

	unsubscribe(listener: RuntimeListener): void {
		this.listeners.delete(listener);
	}

	startSession(): void {
		if (this.startedAtState === null) {
			this.startedAtState = new Date().toISOString();
		}

		this.engine.start();
		this.emit();
	}

	pauseSession(): void {
		this.engine.pause();
	}

	resumeSession(): void {
		this.engine.resume();
	}

	nextPrompt(): void {
		this.engine.advanceToNextEvent();
	}

	finishSession(): void {
		this.captureFinishedAt();
		this.engine.finish();
		this.emit();
	}

	submitInitialAssessment(values: readonly MindfulnessAssessmentValue[]): void {
		this.initialAssessmentState = this.buildAssessmentSnapshot(values);
		this.emit();
	}

	submitAssessment(values: readonly MindfulnessAssessmentValue[]): void {
		const pendingAssessment = this.pendingAssessmentState;

		if (pendingAssessment === null) {
			return;
		}

		const normalizedValues = pendingAssessment.variables.map((variable) => {
			const matchedValue = values.find((candidate) => candidate.variable === variable);

			if (matchedValue === undefined) {
				throw new Error(`Missing assessment value for ${variable}`);
			}

			return {
				variable,
				value: normalizeAssessmentValue(matchedValue.value),
			};
		});

		this.intermediateAssessmentState.push({
			eventId: pendingAssessment.eventId,
			eventTimestampMs: pendingAssessment.eventTimestampMs,
			recordedAt: new Date().toISOString(),
			values: normalizedValues,
		});

		this.pendingAssessmentState = null;
		this.engine.continue();
		this.emit();
	}

	submitFinalAssessment(values: readonly MindfulnessAssessmentValue[]): void {
		this.finalAssessmentState = this.buildAssessmentSnapshot(values);
		this.captureFinishedAt();
		this.emit();
	}

	dispose(): void {
		this.clock.unsubscribe(this.clockListener);
		this.engine.unsubscribe(this.engineListener);
		this.listeners.clear();
	}

	private syncAssessmentState(): void {
		const currentEvent = this.engine.getCurrentEvent();
		const currentState = this.engine.getState();

		if (currentState === SESSION_STATES.FINISHED) {
			this.captureFinishedAt();
		}

		if (currentEvent?.type !== TimelineEventType.ASSESSMENT || currentState !== SESSION_STATES.ASSESSMENT) {
			this.pendingAssessmentState = null;
			return;
		}

		if (this.pendingAssessmentState?.eventId === currentEvent.id) {
			return;
		}

		if (this.config.enabledVariables.length === 0) {
			this.pendingAssessmentState = null;
			this.engine.continue();
			return;
		}

		this.pendingAssessmentState = {
			eventId: currentEvent.id,
			eventTimestampMs: currentEvent.timestampMs,
			variables: [...this.config.enabledVariables],
		};
	}

	private buildAssessmentSnapshot(values: readonly MindfulnessAssessmentValue[]): MindfulnessAssessmentSnapshot {
		const normalizedValues = this.config.enabledVariables.map((variable) => {
			const matchedValue = values.find((candidate) => candidate.variable === variable);

			if (matchedValue === undefined) {
				throw new Error(`Missing assessment value for ${variable}`);
			}

			return {
				variable,
				value: normalizeAssessmentValue(matchedValue.value),
			};
		});

		return {
			recordedAt: new Date().toISOString(),
			values: normalizedValues,
		};
	}

	private captureFinishedAt(): void {
		if (this.finishedAtState === null) {
			this.finishedAtState = new Date().toISOString();
		}
	}

	private emit(): void {
		for (const listener of this.listeners) {
			listener();
		}
	}
}

let preparedRuntime: MindfulnessSessionRuntime | null = null;

function getPracticeLabel(config: MindfulnessSessionConfig): string {
	if (config.practice === "BREATH") {
		return "Respiracion consciente";
	}

	if (config.practice === "BODY_SCAN") {
		return "Escaneo corporal";
	}

	if (config.practice === "THOUGHTS") {
		return "Observacion de pensamientos";
	}

	if (config.practice === "EMOTIONS") {
		return "Observacion de emociones";
	}

	if (config.practice === "CRAVING") {
		return "Surf del craving";
	}

	return "Atencion en los sentidos";
}

function isPromptIndexPayload(payload: unknown): payload is { promptIndex: number } {
	return typeof payload === "object" && payload !== null && "promptIndex" in payload;
}

function getCurrentPrompt(runtime: MindfulnessSessionRuntime): PromptCard | null {
	const event = runtime.engine.getCurrentEvent();

	if (!event || event.type !== TimelineEventType.SHOW_PROMPT || !isPromptIndexPayload(event.payload)) {
		if (event?.type === TimelineEventType.ASSESSMENT) {
			const previousEvent = runtime.engine.getPreviousEvent();

			if (previousEvent?.type === TimelineEventType.SHOW_PROMPT && isPromptIndexPayload(previousEvent.payload)) {
				return runtime.promptSequence[previousEvent.payload.promptIndex] ?? null;
			}
		}

		return null;
	}

	return runtime.promptSequence[event.payload.promptIndex] ?? null;
}

function getSessionTitle(runtime: MindfulnessSessionRuntime): string {
	const remainingMs = runtime.clock.getRemainingMs();
	const state = runtime.engine.getState();

	if (remainingMs === 0 || state === SESSION_STATES.FINISHED) {
		return "Sesión finalizada";
	}

	const event = runtime.engine.getCurrentEvent();

	if (!event) {
		return "Mindfulness";
	}

	if (event.type === TimelineEventType.ASSESSMENT) {
		return "Registro programado";
	}

	return getPracticeLabel(runtime.config);
}

function getSessionMessage(runtime: MindfulnessSessionRuntime): string {
	const remainingMs = runtime.clock.getRemainingMs();
	const state = runtime.engine.getState();

	if (remainingMs === 0 || state === SESSION_STATES.FINISHED) {
		return "La sesión ha concluido.";
	}

	const event = runtime.engine.getCurrentEvent();

	if (!event) {
		return "";
	}

	if (event.type === TimelineEventType.ASSESSMENT) {
		return "Responde la evaluación para reanudar la práctica.";
	}

	const currentPrompt = getCurrentPrompt(runtime);

	if (currentPrompt) {
		return currentPrompt.message;
	}

	return "El motor esta procesando la siguiente tarjeta.";
}

export function prepareMindfulnessSession(config: MindfulnessSessionConfig): MindfulnessSessionRuntime {
	if (preparedRuntime !== null) {
		preparedRuntime.dispose();
		preparedRuntime.engine.reset();
	}

	const clock = new SessionClock();
	const promptProvider = new MindfulnessPromptProvider();
	const scheduler = new MindfulnessScheduler();
	const stateMachine = new MindfulnessStateMachine();
	const promptSequence = promptProvider.getPromptSequence(config);
	const engine = new ClinicalSessionEngine(promptProvider, scheduler, clock, stateMachine, {
		isManuallyAdvancedEvent: (sessionConfig, event) =>
			sessionConfig.sessionMode === SESSION_MODES.MANUAL && event.type === TimelineEventType.SHOW_PROMPT,
	});

	engine.initialize(config);

	preparedRuntime = new PreparedMindfulnessSessionRuntime(
		config,
		clock,
		engine,
		promptSequence,
	);

	return preparedRuntime;
}

export function getPreparedMindfulnessSession(): MindfulnessSessionRuntime | null {
	return preparedRuntime;
}

export function resetPreparedMindfulnessSession(): void {
	if (preparedRuntime !== null) {
		preparedRuntime.dispose();
		preparedRuntime.engine.reset();
		preparedRuntime = null;
	}
}

function normalizeAssessmentValue(value: number): number {
	if (!Number.isInteger(value) || value < 0 || value > 10) {
		throw new RangeError("Assessment values must be integers between 0 and 10");
	}

	return value;
}

export function buildMindfulnessPromptViewModel(
	runtime: MindfulnessSessionRuntime,
): MindfulnessPromptViewModel | null {
	const currentEvent = runtime.engine.getCurrentEvent();

	if (!currentEvent || currentEvent.type === TimelineEventType.START) {
		return null;
	}

	return {
		title: getSessionTitle(runtime),
		message: getSessionMessage(runtime),
	};
}

function formatSessionDateTime(isoValue: string | null): string {
	if (isoValue === null) {
		return "Sin registro";
	}

	return new Intl.DateTimeFormat("es-MX", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(isoValue));
}

function formatDuration(durationMs: number): string {
	const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function buildSummaryValues(
	values: readonly MindfulnessAssessmentValue[],
): readonly MindfulnessSessionSummaryValueViewModel[] {
	return values.map((value) => ({
		variable: value.variable,
		label: ASSESSMENT_VARIABLE_LABELS[value.variable],
		value: String(value.value),
	}));
}

function buildSummaryDetails(runtime: MindfulnessSessionRuntime): readonly MindfulnessSessionSummaryFieldViewModel[] {
	const scheduledDurationMs = runtime.config.durationMinutes * 60 * 1000;
	const effectiveDurationMs = runtime.clock.getElapsedMs();

	return [
		{ label: "Expediente", value: runtime.config.expediente },
		{ label: "Fecha y hora", value: formatSessionDateTime(runtime.startedAt ?? runtime.finishedAt) },
		{ label: "Tipo de práctica", value: getPracticeLabel(runtime.config) },
		{ label: "Duración programada", value: formatDuration(scheduledDurationMs) },
		{ label: "Duración efectiva", value: formatDuration(effectiveDurationMs) },
	];
}

function buildIntermediateAssessments(
	runtime: MindfulnessSessionRuntime,
): readonly MindfulnessSessionIntermediateAssessmentViewModel[] {
	return runtime.intermediateAssessments
		.filter((assessment) => assessment.values.length > 0)
		.map((assessment, index) => ({
			title: `Evaluación ${index + 1}`,
			recordedAt: formatSessionDateTime(assessment.recordedAt),
			values: buildSummaryValues(assessment.values),
		}));
}

export function buildMindfulnessSessionSummaryViewModel(
	runtime: MindfulnessSessionRuntime,
): MindfulnessSessionSummaryViewModel {
	return {
		details: buildSummaryDetails(runtime),
		initialVariables: buildSummaryValues(runtime.initialAssessment?.values ?? []),
		intermediateAssessments: buildIntermediateAssessments(runtime),
		finalVariables: buildSummaryValues(runtime.finalAssessment?.values ?? []),
	};
}
