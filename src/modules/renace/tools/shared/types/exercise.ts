export interface ExerciseMetric {
	id: string;
	label: string;
	value: string | number;
}

export interface ExerciseResult {
	completed: boolean;
	metrics?: ExerciseMetric[];
}
