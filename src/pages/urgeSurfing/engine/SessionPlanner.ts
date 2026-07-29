import type { SessionConfig } from "../types/SessionConfig";
import { urgeSurfingCards, type UrgeSurfingCard } from "../content/cards";
import {
	SESSION_TIMELINE_EVENT_TYPES,
	type SessionTimelineEventType,
	type SessionTimeline,
	type SessionTimelineEvent,
} from "../types/SessionTimeline";

const assessmentRatiosByFrequency: Record<SessionConfig["intermediateRecordFrequency"], number[]> = {
	none: [],
	"25": [0.25, 0.5, 0.75],
	"33": [1 / 3, 2 / 3],
	"50": [0.5],
};

const eventPriority: Record<SessionTimelineEventType, number> = {
	[SESSION_TIMELINE_EVENT_TYPES.CARD]: 1,
	[SESSION_TIMELINE_EVENT_TYPES.ASSESSMENT]: 2,
	[SESSION_TIMELINE_EVENT_TYPES.FINISH]: 3,
};

const CARD_DURATION_SECONDS = 20;
const CLINICAL_BLOCK_ORDER = ["Observación", "Cuerpo", "Respiración", "Aceptación", "Cambio"] as const;

type ClinicalBlockTitle = (typeof CLINICAL_BLOCK_ORDER)[number];

export interface SessionPlan {
	totalDurationSeconds: number;
	cardDurationSeconds: number;
	// Cada tarjeta puede definir su minimo de permanencia sin cambiar SessionEngine.
	cards: UrgeSurfingCard[];
	cardStartTimes: number[];
	assessmentTimes: number[];
	timeline: SessionTimeline;
	cardAdvanceMode: SessionConfig["cardAdvanceMode"];
}

export interface ISessionPlanner {
	planCheckpoints(config: SessionConfig): SessionPlan;
}

export class SessionPlanner implements ISessionPlanner {
	planCheckpoints(config: SessionConfig): SessionPlan {
		const totalDurationSeconds = Math.round(config.durationMinutes * 60);
		const totalCards = urgeSurfingCards.length;

		if (totalCards <= 0) {
			throw new Error("No hay tarjetas configuradas para Urge Surfing.");
		}

		const cardDurationSeconds = CARD_DURATION_SECONDS;
		// Estos tiempos absolutos seran usados por SessionEngine para cambiar automaticamente
		// de tarjeta sin recalcular durante la sesion.
		const cardStartTimes = buildCardStartTimes(totalDurationSeconds, cardDurationSeconds);
		const totalCardsInSession = cardStartTimes.length;
		const plannedCards = buildClinicalCardsSequence(totalCardsInSession, urgeSurfingCards);
		const cards = plannedCards.map((card) => ({
			...card,
			minimumDisplaySeconds: cardDurationSeconds,
		}));
		const assessmentTimes = buildAssessmentTimes(totalDurationSeconds, config.intermediateRecordFrequency);
		const timeline = buildTimeline(totalDurationSeconds, cardStartTimes, assessmentTimes, cards);

		return {
			totalDurationSeconds,
			cardDurationSeconds,
			cards,
			cardStartTimes,
			assessmentTimes,
			timeline,
			cardAdvanceMode: config.cardAdvanceMode,
		};
	}
}

function buildClinicalCardsSequence(totalCardsInSession: number, sourceCards: readonly UrgeSurfingCard[]): UrgeSurfingCard[] {
	if (totalCardsInSession <= 0) {
		return [];
	}

	const cardsByBlock = groupCardsByClinicalBlock(sourceCards);

	for (const block of CLINICAL_BLOCK_ORDER) {
		if (cardsByBlock[block].length <= 0) {
			throw new Error(`No hay tarjetas configuradas para el bloque clinico \"${block}\".`);
		}
	}

	const baseCardsPerBlock = Math.floor(totalCardsInSession / CLINICAL_BLOCK_ORDER.length);
	const remainderCards = totalCardsInSession % CLINICAL_BLOCK_ORDER.length;
	const plannedCards: UrgeSurfingCard[] = [];

	for (let blockIndex = 0; blockIndex < CLINICAL_BLOCK_ORDER.length; blockIndex += 1) {
		const block = CLINICAL_BLOCK_ORDER[blockIndex];
		const cardsInBlock = cardsByBlock[block];
		const cardsNeeded = baseCardsPerBlock + (blockIndex < remainderCards ? 1 : 0);

		for (let index = 0; index < cardsNeeded; index += 1) {
			plannedCards.push(cardsInBlock[index % cardsInBlock.length]);
		}
	}

	return plannedCards;
}

function groupCardsByClinicalBlock(
	sourceCards: readonly UrgeSurfingCard[],
): Record<ClinicalBlockTitle, UrgeSurfingCard[]> {
	const groupedCards: Record<ClinicalBlockTitle, UrgeSurfingCard[]> = {
		Observación: [],
		Cuerpo: [],
		Respiración: [],
		Aceptación: [],
		Cambio: [],
	};

	for (const card of sourceCards) {
		for (const block of CLINICAL_BLOCK_ORDER) {
			if (card.title === block) {
				groupedCards[block].push(card);
				break;
			}
		}
	}

	return groupedCards;
}

function buildCardStartTimes(totalDurationSeconds: number, cardDurationSeconds: number): number[] {
	const cardStartTimes: number[] = [];

	for (let second = 0; second < totalDurationSeconds; second += cardDurationSeconds) {
		cardStartTimes.push(second);
	}

	return cardStartTimes;
}

function buildAssessmentTimes(
	totalDurationSeconds: number,
	frequency: SessionConfig["intermediateRecordFrequency"],
): number[] {
	const ratios = assessmentRatiosByFrequency[frequency] ?? [];
	const seconds = ratios.map((ratio) => Math.round(totalDurationSeconds * ratio));

	return sortAndDedupeSeconds(seconds, totalDurationSeconds);
}

function buildTimeline(
	totalDurationSeconds: number,
	cardStartTimes: number[],
	assessmentTimes: number[],
	cards: UrgeSurfingCard[],
): SessionTimeline {
	const cardEvents: SessionTimelineEvent[] = cardStartTimes.map((second, index) => ({
		type: SESSION_TIMELINE_EVENT_TYPES.CARD,
		second,
		cardId: cards[index]?.id ?? `card-${index + 1}`,
	}));

	const assessmentEvents: SessionTimelineEvent[] = assessmentTimes.map((second) => ({
		type: SESSION_TIMELINE_EVENT_TYPES.ASSESSMENT,
		second,
	}));

	const finishEvent: SessionTimelineEvent = {
		type: SESSION_TIMELINE_EVENT_TYPES.FINISH,
		second: totalDurationSeconds,
	};

	const sortedEvents = [...cardEvents, ...assessmentEvents, finishEvent]
		.filter((event) => isSecondInTimelineRange(event.second, totalDurationSeconds))
		.sort((left, right) => {
			if (left.second !== right.second) {
				return left.second - right.second;
			}

			return eventPriority[left.type] - eventPriority[right.type];
		});

	const uniqueEvents: SessionTimelineEvent[] = [];
	const seen = new Set<string>();

	for (const event of sortedEvents) {
		const eventKey = `${event.type}:${event.second}:${"cardId" in event ? event.cardId : ""}`;

		if (seen.has(eventKey)) {
			continue;
		}

		seen.add(eventKey);
		uniqueEvents.push(event);
	}

	return uniqueEvents;
}

function sortAndDedupeSeconds(seconds: number[], totalDurationSeconds: number): number[] {
	return [...new Set(seconds)]
		.filter((second) => second > 0 && second < totalDurationSeconds)
		.sort((left, right) => left - right);
}

function isSecondInTimelineRange(second: number, totalDurationSeconds: number): boolean {
	return Number.isInteger(second) && second >= 0 && second <= totalDurationSeconds;
}
