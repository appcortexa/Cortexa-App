import type { Timeline } from "./Timeline";
import type { TimelineEvent } from "./TimelineEvent";

/**
 * Cursor reutilizable para recorrer una timeline de forma segura y determinista.
 *
 * Esta clase no conoce logica clinica, tiempos reales ni scheduler.
 * Solo gestiona una posicion interna sobre una secuencia de eventos.
 */
export class TimelineCursor {
	private readonly timelineEvents: readonly TimelineEvent[];
	private index: number;

	constructor(timeline: Timeline) {
		// Se toma un snapshot para evitar efectos externos sin mutar el Timeline original.
		this.timelineEvents = timeline.timelineEvents.slice();
		this.index = 0;
	}

	/** Devuelve el evento actual del cursor. */
	public current(): TimelineEvent | undefined {
		return this.timelineEvents[this.index];
	}

	/**
	 * Avanza al siguiente evento.
	 * Si ya esta al final, permanece en el ultimo indice valido.
	 */
	public next(): TimelineEvent | undefined {
		if (this.hasNext()) {
			this.index += 1;
		}

		return this.current();
	}

	/**
	 * Retrocede al evento anterior.
	 * Si ya esta al inicio, permanece en el primer indice.
	 */
	public previous(): TimelineEvent | undefined {
		if (this.hasPrevious()) {
			this.index -= 1;
		}

		return this.current();
	}

	/** Permite consultar el siguiente evento sin avanzar el cursor. */
	public peekNext(): TimelineEvent | undefined {
		if (!this.hasNext()) {
			return undefined;
		}

		return this.timelineEvents[this.index + 1];
	}

	/** Permite consultar el evento anterior sin retroceder el cursor. */
	public peekPrevious(): TimelineEvent | undefined {
		if (!this.hasPrevious()) {
			return undefined;
		}

		return this.timelineEvents[this.index - 1];
	}

	/** Devuelve true si existe un siguiente evento. */
	public hasNext(): boolean {
		return this.index < this.getLastIndex();
	}

	/** Devuelve true si existe un evento anterior. */
	public hasPrevious(): boolean {
		return this.index > 0 && this.timelineEvents.length > 0;
	}

	/**
	 * Devuelve true unicamente cuando el cursor alcanzo el ultimo evento.
	 * En timeline vacia devuelve false.
	 */
	public isFinished(): boolean {
		return this.timelineEvents.length > 0 && this.index >= this.getLastIndex();
	}

	/** Regresa el cursor al primer evento. */
	public reset(): void {
		this.index = 0;
	}

	/** Devuelve el indice actual, siempre acotado a un rango seguro. */
	public getIndex(): number {
		return this.index;
	}

	/**
	 * Devuelve el progreso normalizado en [0, 1].
	 * - Timeline vacia: 0
	 * - Un solo evento: 1 (inicio y final coinciden)
	 */
	public getProgress(): number {
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