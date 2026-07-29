import type { TimelineCursor } from "../engine/TimelineCursor";
import type { BreathingSessionConfig } from "./BreathingSessionConfig";
import type { BreathingSessionTimeline, BreathingTimelineEvent } from "./BreathingTimeline";
import type { BreathingSessionRuntime } from "../services/BreathingSessionRuntime";
import type { BreathingConductor } from "../services/BreathingConductor";
import type { AssessmentTrigger } from "../services/AssessmentTrigger";
import type { SessionDataCollector } from "../services/SessionDataCollector";

export interface BreathingSessionContext {
	readonly config: BreathingSessionConfig;
	readonly timeline: BreathingSessionTimeline;
	readonly cursor: TimelineCursor<BreathingTimelineEvent>;
	readonly runtime: BreathingSessionRuntime;
	readonly assessmentTrigger: AssessmentTrigger;
	readonly conductor: BreathingConductor;
	readonly sessionDataCollector: SessionDataCollector;
}