import type { PracticeType } from "../models/mindfulness.models";

/**
 * Resuelve y emite prompts segun tipo de practica.
 * Implementacion pendiente.
 */
export interface IPromptEngine {
	setPractice(practice: PracticeType): void;
	getNextPrompt(): string | null;
	reset(): void;
}
