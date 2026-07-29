import type { BreathingPattern } from "./BreathingPattern";

export const BREATHING_PATTERNS_CATALOG: readonly BreathingPattern[] = [
	{
		id: "pattern-4-2-6",
		key: "FOUR_TWO_SIX",
		name: "4-2-6",
		description: "Inhalar 4 segundos, sostener 2 y exhalar 6.",
		phases: [
			{ id: "inhale", key: "INHALE", label: "Inhalar", durationSeconds: 4 },
			{ id: "hold", key: "HOLD", label: "Sostener", durationSeconds: 2 },
			{ id: "exhale", key: "EXHALE", label: "Exhalar", durationSeconds: 6 },
		],
		totalCycleSeconds: 12,
		allowsCustomization: false,
	},
	{
		id: "pattern-4-6",
		key: "FOUR_SIX",
		name: "4-6",
		description: "Inhalar 4 segundos y exhalar 6.",
		phases: [
			{ id: "inhale", key: "INHALE", label: "Inhalar", durationSeconds: 4 },
			{ id: "exhale", key: "EXHALE", label: "Exhalar", durationSeconds: 6 },
		],
		totalCycleSeconds: 10,
		allowsCustomization: false,
	},
	{
		id: "pattern-4-4-4-4",
		key: "BOX_BREATHING",
		name: "4-4-4-4",
		description: "Inhalar, sostener, exhalar y sostener en cuatro tiempos iguales.",
		phases: [
			{ id: "inhale", key: "INHALE", label: "Inhalar", durationSeconds: 4 },
			{ id: "hold-full", key: "HOLD_FULL", label: "Sostener", durationSeconds: 4 },
			{ id: "exhale", key: "EXHALE", label: "Exhalar", durationSeconds: 4 },
			{ id: "hold-empty", key: "HOLD_EMPTY", label: "Sostener", durationSeconds: 4 },
		],
		totalCycleSeconds: 16,
		allowsCustomization: false,
	},
	{
		id: "pattern-custom",
		key: "CUSTOM",
		name: "Personalizado",
		description: "Plantilla editable para definir duraciones en etapas posteriores.",
		phases: [
			{ id: "inhale", key: "INHALE", label: "Inhalar", durationSeconds: null },
			{ id: "hold", key: "HOLD", label: "Sostener", durationSeconds: null },
			{ id: "exhale", key: "EXHALE", label: "Exhalar", durationSeconds: null },
		],
		totalCycleSeconds: null,
		allowsCustomization: true,
	},
] as const;
