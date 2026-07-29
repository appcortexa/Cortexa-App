import {
	ASSESSMENT_FREQUENCIES,
	type AssessmentFrequency,
} from "../../mindfulness/models/mindfulness.models";
import { BREATHING_TIMELINE_EVENT_TYPES } from "../models/BreathingTimeline";
import {
	BREATHING_SESSION_RUNTIME_STATUSES,
	type BreathingSessionRuntime,
} from "./BreathingSessionRuntime";

export interface AssessmentTriggerOptions {
	readonly runtime: BreathingSessionRuntime;
	readonly assessmentFrequency: AssessmentFrequency;
}

export class AssessmentTrigger {
	private readonly runtime: BreathingSessionRuntime;
	private readonly assessmentFrequency: AssessmentFrequency;
	private readonly handledAssessmentEventIds = new Set<string>();
	private readonly listener: () => void;

	constructor(options: AssessmentTriggerOptions) {
		this.runtime = options.runtime;
		this.assessmentFrequency = options.assessmentFrequency;
		this.listener = () => {
			this.evaluate();
		};

		this.runtime.subscribe(this.listener);
	}

	dispose(): void {
		this.runtime.unsubscribe(this.listener);
		this.handledAssessmentEventIds.clear();
	}

	private evaluate(): void {
		if (this.assessmentFrequency === ASSESSMENT_FREQUENCIES.NONE) {
			return;
		}

		const snapshot = this.runtime.getSnapshot();

		if (
			snapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.IDLE ||
			snapshot.status === BREATHING_SESSION_RUNTIME_STATUSES.PREPARING
		) {
			this.handledAssessmentEventIds.clear();
		}

		if (snapshot.status !== BREATHING_SESSION_RUNTIME_STATUSES.RUNNING) {
			return;
		}

		const currentEvent = snapshot.currentEvent ?? this.runtime.getCurrentEvent();

		if (currentEvent?.type !== BREATHING_TIMELINE_EVENT_TYPES.INTERMEDIATE_ASSESSMENT) {
			return;
		}

		if (this.handledAssessmentEventIds.has(currentEvent.id)) {
			return;
		}

		this.handledAssessmentEventIds.add(currentEvent.id);
		this.runtime.pauseForAssessment();
	}
}
