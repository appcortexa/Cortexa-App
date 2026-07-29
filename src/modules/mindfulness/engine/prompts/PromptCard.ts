/**
 * Categoria de la practica a la que pertenece una tarjeta mindfulness.
 */
export type PromptCategory =
	| "breathing"
	| "bodyscan"
	| "thoughts"
	| "emotions"
	| "craving"
	| "senses";

/**
 * Unidad minima de contenido para guiar una practica mindfulness.
 */
export interface PromptCard {
	id: string;
	title: string;
	message: string;
	category: PromptCategory;
	therapistNote?: string;
}
