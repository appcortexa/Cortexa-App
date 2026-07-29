// Configuration model for each clinical Go-NoGo difficulty level.
export interface LevelConfig {
	id: string;
	name: string;
	description: string;
	stimulusDuration: number; // milliseconds
	isi: number; // inter-stimulus interval in milliseconds
	trials: number;
	goPercentage: number;
	noGoPercentage: number;
	allowLevelUp: boolean;
	recommendedSessions: number;
}

// Ordered level catalog used by the training flow and progression rules.
export const LEVELS: Record<string, LevelConfig> = {
	trial: {
		id: "trial",
		name: "Ensayo",
		description: "Familiarización con la prueba",
		stimulusDuration: 1200,
		isi: 1500,
		trials: 20,
		goPercentage: 80,
		noGoPercentage: 20,
		allowLevelUp: false,
		recommendedSessions: 1,
	},
	practice: {
		id: "practice",
		name: "Práctica",
		description: "Consolidación de instrucciones",
		stimulusDuration: 1000,
		isi: 1200,
		trials: 40,
		goPercentage: 75,
		noGoPercentage: 25,
		allowLevelUp: true,
		recommendedSessions: 2,
	},
	easy: {
		id: "easy",
		name: "Fácil",
		description: "Inicio del entrenamiento",
		stimulusDuration: 900,
		isi: 1000,
		trials: 60,
		goPercentage: 80,
		noGoPercentage: 20,
		allowLevelUp: true,
		recommendedSessions: 4,
	},
	medium: {
		id: "medium",
		name: "Medio",
		description: "Incremento de demanda cognitiva",
		stimulusDuration: 750,
		isi: 800,
		trials: 80,
		goPercentage: 82,
		noGoPercentage: 18,
		allowLevelUp: true,
		recommendedSessions: 6,
	},
	hard: {
		id: "hard",
		name: "Difícil",
		description: "Máxima demanda cognitiva",
		stimulusDuration: 600,
		isi: 600,
		trials: 100,
		goPercentage: 80,
		noGoPercentage: 20,
		allowLevelUp: true,
		recommendedSessions: 8,
	},
};
