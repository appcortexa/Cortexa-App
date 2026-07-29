import type {
	ClinicalTimeline,
	ClinicalTimelineEvent,
} from "../../mindfulness/engine/clinical/IScheduler";

/**
 * Cursor puro para recorrer una ClinicalTimeline sin depender de React ni del reloj.
 */
export class TimelineCursor<TEvent extends ClinicalTimelineEvent = ClinicalTimelineEvent> {
	private readonly timelineEvents: readonly TEvent[];
	private index: number;

	constructor(timeline: ClinicalTimeline<TEvent>) {
		this.timelineEvents = timeline.timelineEvents.slice();
		this.index = 0;
	}

	current(): TEvent | undefined {
		return this.timelineEvents[this.index];
	}

	next(): TEvent | undefined {
		if (this.hasNext()) {
			this.index += 1;
		}

		return this.current();
	}

	previous(): TEvent | undefined {
		if (this.hasPrevious()) {
			this.index -= 1;
		}

		return this.current();
	}

	peekNext(): TEvent | undefined {
		if (!this.hasNext()) {
			return undefined;
		}

		return this.timelineEvents[this.index + 1];
	}

	peekPrevious(): TEvent | undefined {
		if (!this.hasPrevious()) {
			return undefined;
		}

		return this.timelineEvents[this.index - 1];
	}

	hasNext(): boolean {
		return this.index < this.getLastIndex();
	}

	hasPrevious(): boolean {
		return this.index > 0 && this.timelineEvents.length > 0;
	}

	isFinished(): boolean {
		return this.timelineEvents.length > 0 && this.index >= this.getLastIndex();
	}

	reset(): void {
		this.index = 0;
	}

	getIndex(): number {
		return this.index;
	}

	getProgress(): number {
		const eventsCount = this.timelineEvents.length;

		if (eventsCount === 0) {
			return 0;
		}

		if (eventsCount === 1) {
			return 1;
		}

		return this.index / (eventsCount - 1);
	}

	private getLastIndex(): number {
		if (this.timelineEvents.length === 0) {
			return 0;
		}

		return this.timelineEvents.length - 1;
	}
}