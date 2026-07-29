import { PRACTICE_TYPES, type PracticeType } from "../../models/mindfulness.models";
import type { PromptSequence } from "./PromptSequence";
import { BodyScanPractice } from "./practices/BodyScanPractice";
import { BreathingPractice } from "./practices/BreathingPractice";
import { CravingPractice } from "./practices/CravingPractice";
import { EmotionsPractice } from "./practices/EmotionsPractice";
import { SensesPractice } from "./practices/SensesPractice";
import { ThoughtsPractice } from "./practices/ThoughtsPractice";

const PROMPT_SEQUENCES_BY_PRACTICE: Record<PracticeType, PromptSequence> = {
	[PRACTICE_TYPES.BREATH]: BreathingPractice,
	[PRACTICE_TYPES.BODY_SCAN]: BodyScanPractice,
	[PRACTICE_TYPES.THOUGHTS]: ThoughtsPractice,
	[PRACTICE_TYPES.EMOTIONS]: EmotionsPractice,
	[PRACTICE_TYPES.CRAVING]: CravingPractice,
	[PRACTICE_TYPES.SENSES]: SensesPractice,
};

/**
 * Punto unico de acceso para resolver secuencias de prompts por practica.
 */
export function getPromptSequence(practice: PracticeType): PromptSequence {
	return PROMPT_SEQUENCES_BY_PRACTICE[practice];
}
