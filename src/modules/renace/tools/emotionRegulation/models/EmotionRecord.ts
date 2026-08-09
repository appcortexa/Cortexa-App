export interface EmotionRecord {
	id: string;
	situation: string;
	emotion: string;
	intensity: number;
	physicalSensations: string[];
	regulationStrategy: string;
	result: string;
	notes?: string;
}
