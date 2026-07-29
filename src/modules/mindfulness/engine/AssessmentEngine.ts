import type {
	AssessmentRecord,
	AssessmentVariable,
} from "../models/mindfulness.models";

/**
 * Gestiona el registro y validacion de evaluaciones durante la sesion.
 * Implementacion pendiente.
 */
export interface IAssessmentEngine {
	registerAssessment(variable: AssessmentVariable, value: number): AssessmentRecord;
	getRecords(): AssessmentRecord[];
	clear(): void;
}
